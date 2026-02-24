import { useCallback } from 'react';

import { FeatureScreen } from '@/shared/ui/FeatureScreen';
import { fetchPaywallData } from './services';

export function PaywallScreen() {
  const load = useCallback(() => fetchPaywallData(), []);

  return <FeatureScreen title="Paywall" load={load} />;
}
