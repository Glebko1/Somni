import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { SubscriptionPlan } from '../common/types/entities';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  free: ['sleep-diary.basic', 'insights.weekly'],
  plus: ['sleep-diary.basic', 'insights.weekly', 'somnik.unlimited', 'cbt.program'],
  premium: [
    'sleep-diary.basic',
    'insights.weekly',
    'somnik.unlimited',
    'cbt.program',
    'voice.assistant',
    'analytics.deep',
  ],
  enterprise: ['*'],
};

@Injectable()
export class SubscriptionService {
  constructor(private readonly store: DataStoreService) {}

  update(userId: string, dto: UpdateSubscriptionDto) {
    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setMonth(validUntil.getMonth() + dto.months);

    const record = {
      id: randomUUID(),
      userId,
      plan: dto.plan,
      validUntil,
      active: true,
      trialStartedAt: dto.includeTrial ? now : undefined,
      trialEndsAt: dto.includeTrial ? this.buildTrialEnd(now) : undefined,
      createdAt: now,
    };

    this.store.subscriptions = this.store.subscriptions.map((s) =>
      s.userId === userId ? { ...s, active: false } : s,
    );
    this.store.subscriptions.push(record);
    return record;
  }

  current(userId: string) {
    return this.store.subscriptions.find((s) => s.userId === userId && s.active) ?? null;
  }

  createStripeCheckout(userId: string, plan: Exclude<SubscriptionPlan, 'free'>) {
    const fakeCheckoutId = `cs_test_${randomUUID().replace(/-/g, '')}`;
    const fakeCustomerId = `cus_${userId.slice(0, 8)}`;

    return {
      checkoutSessionId: fakeCheckoutId,
      checkoutUrl: `https://checkout.stripe.com/pay/${fakeCheckoutId}`,
      customerId: fakeCustomerId,
      plan,
      mode: 'subscription',
    };
  }

  processStripeWebhook(
    payload: {
      eventId: string;
      type: 'customer.subscription.created' | 'customer.subscription.updated' | 'customer.subscription.deleted';
      userId: string;
      stripeSubscriptionId: string;
      stripeCustomerId: string;
      plan: SubscriptionPlan;
    },
    signature: string | undefined,
  ) {
    this.assertWebhookSignature(payload, signature);

    const alreadyProcessed = this.store.processedWebhookEvents.some(
      (event) => event.source === 'stripe' && event.id === payload.eventId,
    );
    if (alreadyProcessed) {
      return { handled: true, status: 'duplicate' as const };
    }
    const now = new Date();
    const existing = this.current(payload.userId);

    if (payload.type === 'customer.subscription.deleted') {
      if (existing) existing.active = false;
      this.store.processedWebhookEvents.push({
        id: payload.eventId,
        source: 'stripe',
        receivedAt: now,
      });
      return { handled: true, status: 'cancelled' as const };
    }

    const next = {
      id: randomUUID(),
      userId: payload.userId,
      plan: payload.plan,
      validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      active: true,
      stripeCustomerId: payload.stripeCustomerId,
      stripeSubscriptionId: payload.stripeSubscriptionId,
      createdAt: now,
    };

    this.store.subscriptions = this.store.subscriptions.map((s) =>
      s.userId === payload.userId ? { ...s, active: false } : s,
    );
    this.store.subscriptions.push(next);
    this.store.processedWebhookEvents.push({
      id: payload.eventId,
      source: 'stripe',
      receivedAt: now,
    });

    return { handled: true, status: 'active' as const, subscriptionId: next.id };
  }

  startTrial(userId: string, trialDays: number) {
    const current = this.current(userId);
    if (current?.trialEndsAt && current.trialEndsAt > new Date()) {
      throw new ForbiddenException('Trial is already active');
    }

    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
    const trial = {
      id: randomUUID(),
      userId,
      plan: 'plus' as const,
      validUntil: trialEndsAt,
      active: true,
      trialStartedAt: now,
      trialEndsAt,
      createdAt: now,
    };

    this.store.subscriptions = this.store.subscriptions.map((s) =>
      s.userId === userId ? { ...s, active: false } : s,
    );
    this.store.subscriptions.push(trial);

    return { active: true, trialStartedAt: now, trialEndsAt };
  }

  canAccessFeature(userId: string, feature: string) {
    const enterpriseLicense = this.store.b2bLicenses.find((license) =>
      license.seatAssignments.includes(userId),
    );
    if (enterpriseLicense) {
      return { allowed: true, reason: 'enterprise-license', plan: 'enterprise' };
    }

    const subscription = this.current(userId);
    const plan = subscription?.plan ?? 'free';
    const features = PLAN_FEATURES[plan] ?? PLAN_FEATURES.free;
    const allowed = features.includes('*') || features.includes(feature);

    return {
      allowed,
      reason: allowed ? 'plan-entitlement' : 'upgrade-required',
      plan,
      trialActive: Boolean(subscription?.trialEndsAt && subscription.trialEndsAt > new Date()),
    };
  }

  createB2BLicense(organizationName: string, seats: number, months: number) {
    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setMonth(validUntil.getMonth() + months);

    const license = {
      id: randomUUID(),
      organizationName,
      plan: seats >= 100 ? ('enterprise' as const) : ('business' as const),
      seats,
      seatAssignments: [],
      validUntil,
      createdAt: now,
    };

    this.store.b2bLicenses.push(license);
    return license;
  }

  assignLicenseSeat(licenseId: string, userId: string) {
    const license = this.store.b2bLicenses.find((item) => item.id === licenseId);
    if (!license) throw new NotFoundException('License not found');
    if (license.seatAssignments.length >= license.seats) {
      throw new ForbiddenException('All seats are assigned');
    }

    if (!license.seatAssignments.includes(userId)) {
      license.seatAssignments.push(userId);
    }

    return {
      licenseId,
      assignedSeats: license.seatAssignments.length,
      availableSeats: license.seats - license.seatAssignments.length,
    };
  }

  trackUsage(userId: string, feature: string, action: string, units = 1) {
    const event = {
      id: randomUUID(),
      userId,
      feature,
      action,
      units,
      createdAt: new Date(),
    };

    this.store.subscriptionUsage.push(event);
    return event;
  }

  getUsageSummary(userId: string, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const events = this.store.subscriptionUsage.filter(
      (event) => event.userId === userId && event.createdAt >= since,
    );

    return {
      periodDays: days,
      totalEvents: events.length,
      totalUnits: events.reduce((acc, event) => acc + event.units, 0),
      byFeature: events.reduce<Record<string, number>>((acc, event) => {
        acc[event.feature] = (acc[event.feature] ?? 0) + event.units;
        return acc;
      }, {}),
    };
  }

  getEnterpriseDashboard() {
    const activeLicenses = this.store.b2bLicenses.filter((license) => license.validUntil > new Date());
    const activeSubscriptions = this.store.subscriptions.filter((sub) => sub.active);

    return {
      kpis: {
        mrrEstimate: activeSubscriptions.reduce((acc, sub) => {
          if (sub.plan === 'plus') return acc + 19;
          if (sub.plan === 'premium') return acc + 39;
          if (sub.plan === 'enterprise') return acc + 299;
          return acc;
        }, 0),
        activeSubscriptions: activeSubscriptions.length,
        activeB2BLicenses: activeLicenses.length,
        allocatedSeats: activeLicenses.reduce((acc, license) => acc + license.seatAssignments.length, 0),
      },
      topFeatures: this.store.subscriptionUsage.reduce<Record<string, number>>((acc, event) => {
        acc[event.feature] = (acc[event.feature] ?? 0) + event.units;
        return acc;
      }, {}),
      generatedAt: new Date().toISOString(),
    };
  }


  private assertWebhookSignature(payload: { eventId: string; userId: string; stripeSubscriptionId: string }, signature: string | undefined) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? 'dev-stripe-webhook-secret';
    if (!signature) {
      throw new UnauthorizedException('Missing webhook signature');
    }

    const content = `${payload.eventId}.${payload.userId}.${payload.stripeSubscriptionId}`;
    const expectedSignature = createHmac('sha256', webhookSecret).update(content).digest('hex');
    const expected = Buffer.from(expectedSignature, 'hex');
    const provided = Buffer.from(signature, 'hex');

    if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  private buildTrialEnd(now: Date) {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
}
