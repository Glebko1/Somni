import { Injectable } from '@nestjs/common';
import {
  CbtEntry,
  DreamEntry,
  Friendship,
  B2BLicense,
  NotificationEntity,
  PaywallExperimentImpression,
  RewardTransaction,
  SleepSession,
  SomnikConversation,
  SubscriptionRecord,
  SubscriptionUsageEvent,
  UserEntity,
} from './types/entities';

@Injectable()
export class DataStoreService {
  users: UserEntity[] = [];
  sleepSessions: SleepSession[] = [];
  cbtEntries: CbtEntry[] = [];
  rewardTransactions: RewardTransaction[] = [];
  somnikConversations: SomnikConversation[] = [];
  subscriptions: SubscriptionRecord[] = [];
  subscriptionUsage: SubscriptionUsageEvent[] = [];
  b2bLicenses: B2BLicense[] = [];
  paywallImpressions: PaywallExperimentImpression[] = [];
  friendships: Friendship[] = [];
  dreams: DreamEntry[] = [];
  notifications: NotificationEntity[] = [];
}
