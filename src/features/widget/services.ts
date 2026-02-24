import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchWidgetData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/widget');
  return response.data;
}

export async function syncWidgetSnapshot(): Promise<void> {
  await apiClient.post('/widget/sync');
}
