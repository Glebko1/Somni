import { useCallback, useState } from 'react';
import { Button, Text, TextInput } from 'react-native';

import { fetchVoiceData } from './services';
import { processVoiceCommand, registerVoiceBackgroundTask } from './voiceEngine';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

export function VoiceScreen() {
  const load = useCallback(() => fetchVoiceData(), []);
  const [command, setCommand] = useState('');
  const [routeHint, setRouteHint] = useState('main');

  return (
    <>
      <FeatureScreen title="Voice Commands" load={load} />
      <TextInput value={command} onChangeText={setCommand} placeholder="Say command" />
      <Button title="Process command" onPress={() => void processVoiceCommand(command).then(setRouteHint)} />
      <Text>Matched route: {routeHint}</Text>
      <Button title="Enable background listening" onPress={() => void registerVoiceBackgroundTask()} />
    </>
  );
}
