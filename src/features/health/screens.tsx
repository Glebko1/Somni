import { useCallback } from 'react';
import { Button } from 'react-native';

import { fetchHealthData, syncHealthMetrics } from './services';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

export function HealthScreen() {
  const load = useCallback(() => fetchHealthData(), []);

  return (
    <>
      <FeatureScreen title="Health Sync" load={load} />
      <Button title="Run health sync" onPress={() => void syncHealthMetrics()} />
    </>
  );
}
