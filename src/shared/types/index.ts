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
