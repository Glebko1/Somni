import { RecommendationPayload, SyncedHealthMetrics } from './types';

const POOR_SLEEP_THRESHOLD_MINUTES = 6 * 60;
const HIGH_STRESS_THRESHOLD = 70;

export function needsRecoveryPush(metrics: SyncedHealthMetrics): boolean {
  return metrics.sleepDurationMinutes < POOR_SLEEP_THRESHOLD_MINUTES && metrics.stressLevel >= HIGH_STRESS_THRESHOLD;
}

export function buildRecoveryRecommendation(metrics: SyncedHealthMetrics): RecommendationPayload {
  return {
    title: 'Somni Recovery Mode',
    message: `Сон ${Math.round(metrics.sleepDurationMinutes / 60)}ч и стресс ${metrics.stressLevel}/100. Сегодня: легкая активность, 4-7-8 дыхание и ранний отбой.`
  };
}
