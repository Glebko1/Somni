import { useCallback } from 'react';
import { Button } from 'react-native';

import { localAudioPlayer } from './player';
import { fetchAudioData } from './services';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

export function AudioScreen() {
  const load = useCallback(() => fetchAudioData(), []);

  return (
    <>
      <FeatureScreen title="Audio Player" load={load} />
      <Button title="Play local track" onPress={() => void localAudioPlayer.play()} />
      <Button title="Stop" onPress={() => void localAudioPlayer.stop()} />
    </>
  );
}
