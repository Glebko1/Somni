import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  advanceFocusState,
  BREATH_CYCLE_MS,
  createSheepAudioEvent,
  hitFocusTarget,
  resolveBreathSegment,
  spawnFocusTarget
} from './engine';
import { youtubeAmbientGatewayStub } from './integrations/youtube';
import { ScreenLayout } from '@/shared/ui/ScreenLayout';
import { palette } from '@/shared/theme/palette';

const RING_MIN_SCALE = 0.7;
const RING_MAX_SCALE = 1.15;

export function RelaxGameScreen() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isSheepModeOn, setIsSheepModeOn] = useState(false);
  const [sheepCount, setSheepCount] = useState(1);
  const [lastAudioCue, setLastAudioCue] = useState('Овечка номер 1. Спокойно дышим.');
  const [focusState, setFocusState] = useState(() => spawnFocusTarget(Date.now()));
  const [ambientSlots, setAmbientSlots] = useState<string[]>([]);
  const ringScale = useRef(new Animated.Value(RING_MIN_SCALE)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedMs((value) => value + 1000 / 60);
      setFocusState((state) => advanceFocusState(state, Date.now()));
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, {
          toValue: RING_MAX_SCALE,
          duration: 4000,
          useNativeDriver: true
        }),
        Animated.timing(ringScale, {
          toValue: RING_MAX_SCALE,
          duration: 4000,
          useNativeDriver: true
        }),
        Animated.timing(ringScale, {
          toValue: RING_MIN_SCALE,
          duration: 6000,
          useNativeDriver: true
        })
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [ringScale]);

  useEffect(() => {
    if (!isSheepModeOn) {
      return;
    }

    const interval = setInterval(() => {
      setSheepCount((count) => {
        const next = count + 1;
        setLastAudioCue(createSheepAudioEvent(next).text);
        return next;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isSheepModeOn]);

  useEffect(() => {
    void youtubeAmbientGatewayStub.getPresets().then((presets) => {
      setAmbientSlots(presets.map((preset) => preset.title));
    });
  }, []);

  const segment = useMemo(() => resolveBreathSegment(elapsedMs), [elapsedMs]);

  const onTargetPress = () => {
    setFocusState((state) => hitFocusTarget(state, Date.now()));
  };

  return (
    <ScreenLayout>
      <Text style={styles.title}>Relax Mini Game</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Дыхательная механика</Text>
        <Animated.View style={[styles.breathRing, { transform: [{ scale: ringScale }] }]} />
        <Text style={styles.primary}>{segment.cue}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Подсчёт овечек (аудио)</Text>
        <Pressable style={styles.button} onPress={() => setIsSheepModeOn((value) => !value)}>
          <Text style={styles.buttonText}>{isSheepModeOn ? 'Остановить аудио-режим' : 'Запустить аудио-режим'}</Text>
        </Pressable>
        <Text style={styles.primary}>Овечек: {sheepCount}</Text>
        <Text style={styles.secondary}>🔊 {lastAudioCue}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Спокойный фокус-челлендж</Text>
        <Pressable style={styles.focusTarget} onPress={onTargetPress}>
          <Text style={styles.buttonText}>Мягкий тап</Text>
        </Pressable>
        <Text style={styles.primary}>Попадания: {focusState.score}</Text>
        <Text style={styles.secondary}>Пропуски: {focusState.misses}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Future YouTube Ambient Slots</Text>
        {ambientSlots.map((slot) => (
          <Text key={slot} style={styles.secondary}>
            • {slot}
          </Text>
        ))}
        <Text style={styles.secondary}>Интеграция зарезервирована отдельным gateway-модулем.</Text>
      </View>

      <Text style={styles.footer}>Цикл обновления: {Math.round(60000 / BREATH_CYCLE_MS)} дыхательных циклов/минуту</Text>
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
    width: '100%',
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 16,
    gap: 10
  },
  cardTitle: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '700'
  },
  primary: {
    color: palette.textPrimary,
    fontSize: 16
  },
  secondary: {
    color: palette.textSecondary,
    fontSize: 13
  },
  breathRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: palette.accent,
    backgroundColor: '#ffffff05'
  },
  button: {
    backgroundColor: palette.accent,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start'
  },
  buttonText: {
    color: '#0B1221',
    fontWeight: '600'
  },
  focusTarget: {
    width: 120,
    borderRadius: 999,
    backgroundColor: '#2DCCB180',
    paddingVertical: 16,
    alignItems: 'center'
  },
  footer: {
    color: palette.textSecondary,
    fontSize: 12,
    textAlign: 'center'
  }
});
