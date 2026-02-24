import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/shared/theme/palette';

export function AvatarCard({ name, unlocked }: { name: string; unlocked: boolean }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.state}>{unlocked ? 'Unlocked' : 'Locked'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.surface, padding: 12, borderRadius: 10 },
  name: { color: palette.textPrimary, fontWeight: '600' },
  state: { color: palette.textSecondary }
});
