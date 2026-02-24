import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchGamificationData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/gamification');
  return response.data;
}
