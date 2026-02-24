import { useCallback } from 'react';

import { SomnikAnimated } from './components/SomnikAnimated';
import { fetchSomnikData } from './services';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

export function SomnikScreen() {
  const load = useCallback(() => fetchSomnikData(), []);

  return (
    <>
      <SomnikAnimated />
      <FeatureScreen title="Somnik" load={load} />
    </>
  );
}
