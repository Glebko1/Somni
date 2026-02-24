import { useCallback } from 'react';

import { FeatureScreen } from '@/shared/ui/FeatureScreen';
import { fetchWorryDumpData } from './services';

export function WorryDumpScreen() {
  const load = useCallback(() => fetchWorryDumpData(), []);

  return <FeatureScreen title="WorryDump" load={load} />;
}
