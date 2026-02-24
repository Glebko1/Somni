import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

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
}
