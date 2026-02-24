export type UserRole = 'user' | 'admin';

export interface UserEntity {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface SleepSession {
  id: string;
  userId: string;
  sleepStart: Date;
  wakeUp: Date;
  interruptions: number;
  deepSleepMinutes: number;
  remMinutes: number;
  efficiency: number;
  sleepWindowStart: string;
  sleepWindowEnd: string;
  createdAt: Date;
}

export interface CbtEntry {
  id: string;
  userId: string;
  trigger: string;
  thought: string;
  reframedThought: string;
  moodBefore: number;
  moodAfter: number;
  createdAt: Date;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  source: string;
  points: number;
  createdAt: Date;
}

export interface SomnikConversation {
  id: string;
  userId: string;
  message: string;
  answer: string;
  createdAt: Date;
}

export type SubscriptionPlan = 'free' | 'plus' | 'premium' | 'enterprise';

export interface SubscriptionRecord {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  validUntil: Date;
  active: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialStartedAt?: Date;
  trialEndsAt?: Date;
  createdAt: Date;
}

export interface SubscriptionUsageEvent {
  id: string;
  userId: string;
  feature: string;
  action: string;
  units: number;
  createdAt: Date;
}

export interface B2BLicense {
  id: string;
  organizationName: string;
  plan: 'business' | 'enterprise';
  seats: number;
  seatAssignments: string[];
  validUntil: Date;
  createdAt: Date;
}

export interface PaywallExperimentImpression {
  id: string;
  userId: string;
  variant: 'control' | 'social-proof';
  converted: boolean;
  createdAt: Date;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  createdAt: Date;
}

export interface DreamEntry {
  id: string;
  userId: string;
  dreamText: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  interpretation: string;
  tags: string[];
  createdAt: Date;
}

export interface NotificationEntity {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  scheduledAt: Date;
  createdAt: Date;
}
