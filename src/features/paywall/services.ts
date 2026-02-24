import { apiClient } from '@/shared/api/client';
import { PaywallPayload } from '@/shared/types';

export async function fetchPaywallData(): Promise<PaywallPayload> {
  const response = await apiClient.get<PaywallPayload>('/paywall');
  return response.data;
}

export async function trackPaywallConversion(variant: 'control' | 'social-proof', converted: boolean) {
  await apiClient.post('/paywall/track', {
    variant,
    converted,
  });
}
