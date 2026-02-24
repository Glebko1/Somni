import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchSomnikData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/somnik');
  return response.data;
}
