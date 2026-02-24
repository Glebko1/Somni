import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ScreenLayout } from './ScreenLayout';
import { palette } from '@/shared/theme/palette';
import { ScreenPayload } from '@/shared/types';

export function FeatureScreen({
  title,
  load
}: {
  title: string;
  load: () => Promise<ScreenPayload>;
}) {
  const [payload, setPayload] = useState<ScreenPayload | null>(null);

  useEffect(() => {
    void load().then(setPayload);
  }, [load]);

  return (
    <ScreenLayout>
      <Text style={styles.title}>{title}</Text>
      {!payload ? (
        <ActivityIndicator color={palette.accent} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.content}>{payload.content}</Text>
          <Text style={styles.timestamp}>Updated: {payload.updatedAt}</Text>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.textPrimary,
    fontSize: 24,
    fontWeight: '700'
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8
  },
  content: {
    color: palette.textPrimary,
    fontSize: 16
  },
  timestamp: {
    color: palette.textSecondary
  }
});
