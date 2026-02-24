import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { apiClient } from '@/shared/api/client';

import { buildRecoveryRecommendation, needsRecoveryPush } from './recommendations';
import { collectFromAllProviders } from './providers';
import { HealthSyncPayload } from './types';

const HEALTH_SYNC_TASK = 'somni-health-sync-task';
const MORNING_SYNC_INTERVAL_SECONDS = 30 * 60;
const DAY_SYNC_INTERVAL_SECONDS = 3 * 60 * 60;

let lastSyncAt = 0;

function getAdaptiveIntervalSeconds(date = new Date()) {
  const hour = date.getHours();
  const isMorningWindow = hour >= 6 && hour <= 11;
  return isMorningWindow ? MORNING_SYNC_INTERVAL_SECONDS : DAY_SYNC_INTERVAL_SECONDS;
}

function shouldSkipSync(nowMs: number, minIntervalSeconds: number) {
  if (!lastSyncAt) {
    return false;
  }

  return nowMs - lastSyncAt < minIntervalSeconds * 1000;
}

export async function runHealthSync(batteryOptimized = true): Promise<void> {
  const minIntervalSeconds = batteryOptimized ? getAdaptiveIntervalSeconds() : MORNING_SYNC_INTERVAL_SECONDS;
  const nowMs = Date.now();

  if (batteryOptimized && shouldSkipSync(nowMs, minIntervalSeconds)) {
    return;
  }

  const providerResults = await collectFromAllProviders();
  const payload: HealthSyncPayload = {
    providers: providerResults.map((result) => result.provider),
    metrics: providerResults.map((result) => result.metrics),
    batteryOptimized
  };

  await apiClient.post('/health/sync', payload);

  const worstSnapshot = payload.metrics.sort((a, b) => b.stressLevel - a.stressLevel)[0];
  if (worstSnapshot && needsRecoveryPush(worstSnapshot)) {
    await apiClient.post('/notifications', buildRecoveryRecommendation(worstSnapshot));
  }

  lastSyncAt = nowMs;
}

TaskManager.defineTask(HEALTH_SYNC_TASK, async () => {
  await runHealthSync(true);
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export async function registerHealthBackgroundSyncTask(): Promise<void> {
  await BackgroundFetch.registerTaskAsync(HEALTH_SYNC_TASK, {
    minimumInterval: getAdaptiveIntervalSeconds(),
    stopOnTerminate: false,
    startOnBoot: true
  });
}
