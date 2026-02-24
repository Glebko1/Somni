import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchAudioData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/audio');
  return response.data;
}
