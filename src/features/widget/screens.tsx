import { useCallback } from 'react';
import { Button } from 'react-native';

import { fetchWidgetData, syncWidgetSnapshot } from './services';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

export function WidgetScreen() {
  const load = useCallback(() => fetchWidgetData(), []);

  return (
    <>
      <FeatureScreen title="Widget Integration" load={load} />
      <Button title="Sync widget snapshot" onPress={() => void syncWidgetSnapshot()} />
    </>
  );
}
