import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';

@Injectable()
export class PaywallService {
  constructor(private readonly store: DataStoreService) {}

  getPaywall(userId: string) {
    const variant = this.resolveVariant(userId);

    if (variant === 'social-proof') {
      return {
        title: 'Sleep better in 7 nights',
        content:
          'Join 12000+ users and unlock CBT-I protocols, AI coaching, and adaptive recommendations.',
        updatedAt: new Date().toISOString(),
        abVariant: variant,
        plans: [
          { id: 'plus', price: '$19/mo', badge: 'Most Popular', cta: 'Start 7-day trial' },
          { id: 'premium', price: '$39/mo', badge: 'Best Results', cta: 'Upgrade to Premium' },
        ],
      };
    }

    return {
      title: 'Unlock premium sleep recovery',
      content: 'Get personalized Somnik coaching, full analytics, and voice assistant automations.',
      updatedAt: new Date().toISOString(),
      abVariant: variant,
      plans: [
        { id: 'plus', price: '$19/mo', badge: 'Value', cta: 'Try Plus' },
        { id: 'premium', price: '$39/mo', badge: 'Advanced', cta: 'Try Premium' },
      ],
    };
  }

  trackImpression(userId: string, variant: 'control' | 'social-proof', converted: boolean) {
    const impression = {
      id: randomUUID(),
      userId,
      variant,
      converted,
      createdAt: new Date(),
    };
    this.store.paywallImpressions.push(impression);

    const totals = this.store.paywallImpressions.filter((item) => item.variant === variant);
    const conversions = totals.filter((item) => item.converted).length;

    return {
      tracked: true,
      variant,
      conversionRate: totals.length ? Number(((conversions / totals.length) * 100).toFixed(2)) : 0,
      sampleSize: totals.length,
    };
  }

  private resolveVariant(userId: string): 'control' | 'social-proof' {
    const checksum = [...userId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return checksum % 2 === 0 ? 'control' : 'social-proof';
  }
}
