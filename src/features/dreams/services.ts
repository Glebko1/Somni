import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchDreamsData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/dreams');
  return response.data;
}
