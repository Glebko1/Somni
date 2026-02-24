export type HealthProvider = 'samsung_health' | 'xiaomi_health' | 'google_health_connect';

export type SyncedHealthMetrics = {
  heartRate: number;
  sleepDurationMinutes: number;
  stressLevel: number;
  capturedAt: string;
};

export type ProviderSyncResult = {
  provider: HealthProvider;
  metrics: SyncedHealthMetrics;
};

export type RecommendationPayload = {
  title: string;
  message: string;
};

export type HealthSyncPayload = {
  providers: HealthProvider[];
  metrics: SyncedHealthMetrics[];
  batteryOptimized: boolean;
};
