import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchVoiceData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/voice');
  return response.data;
}
