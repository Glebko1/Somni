export type ApiResponse<T> = {
  data: T;
  message: string;
};

export type UserProfile = {
  id: string;
  name: string;
  onboardingCompleted: boolean;
  subscriptionStatus: 'free' | 'premium';
};

export type ScreenPayload = {
  title: string;
  content: string;
  updatedAt: string;
};

export type PaywallPlan = {
  id: 'plus' | 'premium';
  price: string;
  badge: string;
  cta: string;
};

export type PaywallPayload = ScreenPayload & {
  abVariant: 'control' | 'social-proof';
  plans: PaywallPlan[];
};
