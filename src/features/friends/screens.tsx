import { useCallback } from 'react';

import { FeatureScreen } from '@/shared/ui/FeatureScreen';
import { fetchFriendsData } from './services';

export function FriendsScreen() {
  const load = useCallback(() => fetchFriendsData(), []);

  return <FeatureScreen title="Friends Ranking" load={load} />;
}
