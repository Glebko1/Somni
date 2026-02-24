import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchFriendsData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/friends');
  return response.data;
}
