import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchHealthData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/health');
  return response.data;
}

export async function syncHealthMetrics(): Promise<void> {
  await apiClient.post('/health/sync', {
    provider: 'apple_healthkit_google_fit'
  });
}
