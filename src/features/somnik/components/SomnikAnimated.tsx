import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { palette } from '@/shared/theme/palette';

export function SomnikAnimated() {
  const pulse = useSharedValue(0.85);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.05, { duration: 1800 }), -1, true);
  }, [pulse]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }]
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.blob, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginVertical: 20 },
  blob: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: palette.accent,
    opacity: 0.6
  }
});
