import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../common/data-store.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly store: DataStoreService) {}

  getProfile(userId: string) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    const { password, ...safe } = user;
    return safe;
  }

  updateProfile(userId: string, dto: UpdateUserDto) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    if (dto.name) user.name = dto.name;
    const { password, ...safe } = user;
    return safe;
  }

  exportData(userId: string) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    const withoutSecrets = { ...user, password: undefined, refreshTokenHash: undefined };

    return {
      profile: withoutSecrets,
      sleepSessions: this.store.sleepSessions.filter((item) => item.userId === userId),
      cbtEntries: this.store.cbtEntries.filter((item) => item.userId === userId),
      dreams: this.store.dreams.filter((item) => item.userId === userId),
      notifications: this.store.notifications.filter((item) => item.userId === userId),
      subscriptions: this.store.subscriptions.filter((item) => item.userId === userId),
      generatedAt: new Date().toISOString(),
    };
  }

  updateConsent(userId: string, consent: boolean) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    user.consentGivenAt = consent ? new Date() : undefined;
    return { consentGiven: Boolean(user.consentGivenAt) };
  }

  updateHealthSync(userId: string, enabled: boolean) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    user.healthSyncEnabled = enabled;
    return { healthSyncEnabled: user.healthSyncEnabled };
  }

  updateAnalyticsOptOut(userId: string, enabled: boolean) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    user.analyticsOptOut = enabled;
    return { analyticsOptOut: user.analyticsOptOut };
  }

  deleteMyData(userId: string) {
    this.store.users = this.store.users.filter((u) => u.id !== userId);
    this.store.sleepSessions = this.store.sleepSessions.filter((item) => item.userId !== userId);
    this.store.cbtEntries = this.store.cbtEntries.filter((item) => item.userId !== userId);
    this.store.rewardTransactions = this.store.rewardTransactions.filter((item) => item.userId !== userId);
    this.store.somnikConversations = this.store.somnikConversations.filter((item) => item.userId !== userId);
    this.store.subscriptions = this.store.subscriptions.filter((item) => item.userId !== userId);
    this.store.subscriptionUsage = this.store.subscriptionUsage.filter((item) => item.userId !== userId);
    this.store.friendships = this.store.friendships.filter((item) => item.userId !== userId && item.friendId !== userId);
    this.store.dreams = this.store.dreams.filter((item) => item.userId !== userId);
    this.store.notifications = this.store.notifications.filter((item) => item.userId !== userId);

    return { deleted: true };
  }
}
