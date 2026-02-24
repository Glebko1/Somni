import { Injectable } from '@nestjs/common';
import {
  CbtEntry,
  DreamEntry,
  Friendship,
  NotificationEntity,
  RewardTransaction,
  SleepSession,
  SomnikConversation,
  SubscriptionRecord,
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
  friendships: Friendship[] = [];
  dreams: DreamEntry[] = [];
  notifications: NotificationEntity[] = [];
}
