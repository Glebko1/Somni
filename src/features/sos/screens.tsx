import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fetchSosData } from './services';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';
import { palette } from '@/shared/theme/palette';

export function SosScreen() {
  const load = useCallback(() => fetchSosData(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.note}>SOS Mode · minimal light</Text>
      <FeatureScreen title="SOS Mode" load={load} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.sosRed
  },
  note: {
    color: palette.textPrimary,
    textAlign: 'center',
    paddingTop: 12
  }
});
