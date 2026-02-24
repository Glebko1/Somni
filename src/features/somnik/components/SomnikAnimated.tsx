import { useMemo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

import { palette } from '@/shared/theme/palette';
import { SomnikEvolutionStage, SomnikReaction, getAnimationPreset } from '@/features/somnik/system';

type SomnikAnimatedProps = {
  stage: SomnikEvolutionStage;
  reaction: SomnikReaction;
  sleepQualityPercent: number;
  sleepQualityLabel: 'poor' | 'fair' | 'good' | 'great';
  skinName: string;
};

const STAGE_SIZE: Record<SomnikEvolutionStage, number> = {
  seed: 92,
  dreamling: 106,
  guardian: 120,
  sage: 132,
  astral: 144
};

const STAGE_COLOR: Record<SomnikEvolutionStage, string> = {
  seed: '#88A4FF',
  dreamling: '#7A8FFF',
  guardian: '#6FD6A6',
  sage: '#E1B97A',
  astral: '#B492FF'
};

const REACTION_FACE: Record<SomnikReaction, string> = {
  sleepy: '◡',
  energetic: '◠',
  sad: '﹏'
};

export function SomnikAnimated({
  stage,
  reaction,
  sleepQualityPercent,
  sleepQualityLabel,
  skinName
}: SomnikAnimatedProps) {
  const scale = useSharedValue(1);
  const bob = useSharedValue(0);

  const preset = useMemo(() => getAnimationPreset(reaction), [reaction]);

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(preset.idleScale, { duration: preset.idleDurationMs }), withTiming(1, { duration: preset.idleDurationMs })), -1, false);
    bob.value = withRepeat(
      withSequence(
        withTiming(-preset.bobDistance, { duration: preset.bobDurationMs }),
        withTiming(preset.bobDistance, { duration: preset.bobDurationMs })
      ),
      -1,
      true
    );
  }, [bob, preset, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: bob.value }]
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.mascot,
          {
            width: STAGE_SIZE[stage],
            height: STAGE_SIZE[stage],
            borderRadius: STAGE_SIZE[stage] / 2,
            backgroundColor: STAGE_COLOR[stage]
          },
          animatedStyle
        ]}
      >
        <Text style={styles.eyes}>◕ ◕</Text>
        <Text style={styles.mouth}>{REACTION_FACE[reaction]}</Text>
      </Animated.View>

      <View style={styles.widgetCard}>
        <Text style={styles.widgetTitle}>Sleep Quality</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${sleepQualityPercent}%` }]} />
        </View>
        <Text style={styles.widgetValue}>
          {sleepQualityPercent}% · {sleepQualityLabel.toUpperCase()}
        </Text>
        <Text style={styles.widgetMeta}>
          Form: {stage} · Skin: {skinName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 16,
    gap: 16
  },
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 }
  },
  eyes: {
    color: palette.background,
    fontSize: 22,
    marginBottom: 4,
    fontWeight: '700'
  },
  mouth: {
    color: palette.background,
    fontSize: 28,
    lineHeight: 32
  },
  widgetCard: {
    width: '92%',
    borderRadius: 14,
    padding: 14,
    backgroundColor: palette.surface
  },
  widgetTitle: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: palette.surfaceMuted,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.accent
  },
  widgetValue: {
    color: palette.textPrimary,
    marginTop: 8,
    fontWeight: '700'
  },
  widgetMeta: {
    color: palette.textSecondary,
    marginTop: 4,
    fontSize: 12
  }
});
