import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchPaywallData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/paywall');
  return response.data;
}
