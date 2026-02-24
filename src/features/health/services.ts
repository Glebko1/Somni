import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

import { runHealthSync } from './syncEngine';

export async function fetchHealthData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/health');
  return response.data;
}

export async function syncHealthMetrics(): Promise<void> {
  await runHealthSync(true);
}

export async function syncHealthMetricsNow(): Promise<void> {
  await runHealthSync(false);
}
