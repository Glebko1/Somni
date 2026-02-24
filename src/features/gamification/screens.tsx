import { useCallback } from 'react';
import { Text } from 'react-native';

import { calculateXp } from './engine';
import { fetchGamificationData } from './services';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

export function GamificationScreen() {
  const load = useCallback(() => fetchGamificationData(), []);
  const xpPreview = calculateXp({ streakDays: 5, xp: 120 });

  return (
    <>
      <FeatureScreen title="Gamification Engine" load={load} />
      <Text style={{ color: 'white' }}>Projected XP: {xpPreview}</Text>
    </>
  );
}
