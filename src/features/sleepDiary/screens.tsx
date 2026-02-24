import { useCallback } from 'react';

import { FeatureScreen } from '@/shared/ui/FeatureScreen';
import { fetchSleepDiaryData } from './services';

export function SleepDiaryScreen() {
  const load = useCallback(() => fetchSleepDiaryData(), []);

  return <FeatureScreen title="SleepDiary" load={load} />;
}
