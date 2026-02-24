import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchWorryDumpData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/worryDump');
  return response.data;
}
