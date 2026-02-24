import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchOnboardingData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/onboarding');
  return response.data;
}
