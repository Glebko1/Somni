import { useCallback } from 'react';
import { Button } from 'react-native';

import { fetchRemindersData, scheduleReminder } from './services';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';

export function RemindersScreen() {
  const load = useCallback(() => fetchRemindersData(), []);

  return (
    <>
      <FeatureScreen title="Reminder System" load={load} />
      <Button title="Schedule 22:30 reminder" onPress={() => void scheduleReminder('22:30')} />
    </>
  );
}
