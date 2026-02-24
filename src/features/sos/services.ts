import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchSosData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/sos');
  return response.data;
}
