import { useCallback } from 'react';

import { AvatarCard } from './components/AvatarCard';
import { fetchRewardsData } from './services';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

export function RewardsScreen() {
  const load = useCallback(() => fetchRewardsData(), []);

  return (
    <>
      <FeatureScreen title="Reward Avatars" load={load} />
      <AvatarCard name="Luna" unlocked />
      <AvatarCard name="Noctis" unlocked={false} />
    </>
  );
}
