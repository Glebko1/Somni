import { useEffect } from 'react';

import { setHealthSyncLowEndMode } from '@/features/health/syncEngine';
import { detectLowEndDeviceMode } from '@/shared/performance/deviceMode';
import { secureStorage } from '@/shared/storage/secureStorage';
import { useAppStore } from '@/store/appStore';

export function useBootstrap() {
  const setHydrated = useAppStore((state) => state.setHydrated);
  const setLowEndDevice = useAppStore((state) => state.setLowEndDevice);

  useEffect(() => {
    void (async () => {
      const isLowEndDevice = detectLowEndDeviceMode();
      setLowEndDevice(isLowEndDevice);
      setHealthSyncLowEndMode(isLowEndDevice);
      await secureStorage.get('authToken');
      setHydrated(true);
    })();
  }, [setHydrated, setLowEndDevice]);
}
