import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchRewardsData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/rewards');
  return response.data;
}
