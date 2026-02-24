import { useCallback, useEffect } from 'react';
import { Button, View } from 'react-native';

import { fetchHealthData, syncHealthMetrics, syncHealthMetricsNow } from './services';
import { registerHealthBackgroundSyncTask } from './syncEngine';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

export function HealthScreen() {
  const load = useCallback(() => fetchHealthData(), []);

  useEffect(() => {
    void registerHealthBackgroundSyncTask();
  }, []);

  return (
    <>
      <FeatureScreen title="Health Sync" load={load} />
      <View>
        <Button title="Run battery-optimized sync" onPress={() => void syncHealthMetrics()} />
        <Button title="Run immediate sync" onPress={() => void syncHealthMetricsNow()} />
      </View>
    </>
  );
}
