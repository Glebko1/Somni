import { useCallback, useMemo } from 'react';

import { SomnikAnimated } from './components/SomnikAnimated';
import { fetchSomnikData } from './services';
import {
  SOMNIK_SKINS,
  buildWidgetPayload,
  calculateRewards,
  deriveSomnikState,
  type SleepSnapshot
} from './system';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

const demoSnapshot: SleepSnapshot = {
  efficiency: 82,
  consistency: 76,
  recoveredMinutes: 95,
  sleepDebtMinutes: 38
};

export function SomnikScreen() {
  const load = useCallback(() => fetchSomnikData(), []);

  const somnik = useMemo(() => {
    const rewards = calculateRewards(360, demoSnapshot, ['classic'], ['recovery-avatar-1']);
    const state = deriveSomnikState(demoSnapshot, rewards, 'aurora');
    const widget = buildWidgetPayload(state, 72);

    return {
      state,
      widget,
      skinName: SOMNIK_SKINS.find((skin) => skin.id === state.selectedSkin)?.name ?? 'Classic Glow'
    };
  }, []);

  return (
    <>
      <SomnikAnimated
        stage={somnik.state.stage}
        reaction={somnik.state.reaction}
        sleepQualityPercent={somnik.widget.sleepQuality.percent}
        sleepQualityLabel={somnik.widget.sleepQuality.label}
        skinName={somnik.skinName}
      />
      <FeatureScreen title="Somnik" load={load} />
    </>
  );
}
