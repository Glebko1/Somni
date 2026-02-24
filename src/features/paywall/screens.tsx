import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenLayout } from '@/shared/ui/ScreenLayout';
import { palette } from '@/shared/theme/palette';
import { PaywallPayload } from '@/shared/types';
import { fetchPaywallData, trackPaywallConversion } from './services';

export function PaywallScreen() {
  const [payload, setPayload] = useState<PaywallPayload | null>(null);

  const load = useCallback(() => fetchPaywallData(), []);

  useEffect(() => {
    void load().then((data) => {
      setPayload(data);
      void trackPaywallConversion(data.abVariant, false);
    });
  }, [load]);

  const onCtaPress = (planId: string) => {
    if (!payload) return;
    void trackPaywallConversion(payload.abVariant, true);
    setPayload({ ...payload, content: `Redirecting to ${planId} checkout...` });
  };

  return (
    <ScreenLayout>
      {!payload ? (
        <ActivityIndicator color={palette.accent} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>{payload.title}</Text>
          <Text style={styles.variant}>A/B Variant: {payload.abVariant}</Text>
          <Text style={styles.content}>{payload.content}</Text>
          <View style={styles.planList}>
            {payload.plans.map((plan) => (
              <View style={styles.planCard} key={plan.id}>
                <Text style={styles.planBadge}>{plan.badge}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Pressable style={styles.cta} onPress={() => onCtaPress(plan.id)}>
                  <Text style={styles.ctaText}>{plan.cta}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  variant: {
    color: palette.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    color: palette.textPrimary,
    fontSize: 16,
  },
  planList: {
    gap: 10,
  },
  planCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  planBadge: {
    color: palette.accent,
    fontWeight: '700',
  },
  planPrice: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  cta: {
    backgroundColor: palette.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
  },
});
