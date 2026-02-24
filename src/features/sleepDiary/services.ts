import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchSleepDiaryData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/sleepDiary');
  return response.data;
}
