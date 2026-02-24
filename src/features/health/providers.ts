import { HealthProvider, ProviderSyncResult } from './types';

type HealthAdapter = {
  provider: HealthProvider;
  collectMetrics: () => Promise<ProviderSyncResult>;
};

const nowIso = () => new Date().toISOString();

const adapters: HealthAdapter[] = [
  {
    provider: 'samsung_health',
    collectMetrics: async () => ({
      provider: 'samsung_health',
      metrics: {
        heartRate: 76,
        sleepDurationMinutes: 390,
        stressLevel: 72,
        capturedAt: nowIso()
      }
    })
  },
  {
    provider: 'xiaomi_health',
    collectMetrics: async () => ({
      provider: 'xiaomi_health',
      metrics: {
        heartRate: 73,
        sleepDurationMinutes: 405,
        stressLevel: 68,
        capturedAt: nowIso()
      }
    })
  },
  {
    provider: 'google_health_connect',
    collectMetrics: async () => ({
      provider: 'google_health_connect',
      metrics: {
        heartRate: 75,
        sleepDurationMinutes: 378,
        stressLevel: 74,
        capturedAt: nowIso()
      }
    })
  }
];

export async function collectFromAllProviders() {
  return Promise.all(adapters.map((adapter) => adapter.collectMetrics()));
}
