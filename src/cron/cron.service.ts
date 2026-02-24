import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataStoreService } from '../common/data-store.service';

@Injectable()
export class CronService {
  constructor(private readonly store: DataStoreService) {}

  @Cron(CronExpression.EVERY_HOUR)
  expireSubscriptions() {
    const now = new Date();
    for (const sub of this.store.subscriptions) {
      if (sub.active && sub.validUntil < now) {
        sub.active = false;
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  scheduleMorningNotifications() {
    const now = new Date();
    const dueUsers = [...new Set(this.store.users.map((u) => u.id))];
    for (const userId of dueUsers) {
      this.store.notifications.push({
        id: `${userId}-${now.getTime()}`,
        userId,
        title: 'Доброе утро',
        message: 'Не забудь заполнить sleep log и получить баллы.',
        read: false,
        scheduledAt: now,
        createdAt: now,
      });
    }
  }
}
