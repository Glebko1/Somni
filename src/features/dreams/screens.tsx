import { useCallback } from 'react';

import { FeatureScreen } from '@/shared/ui/FeatureScreen';
import { fetchDreamsData } from './services';

export function DreamsScreen() {
  const load = useCallback(() => fetchDreamsData(), []);

  return <FeatureScreen title="Dream Interpretation" load={load} />;
}
