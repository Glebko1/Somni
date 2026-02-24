import { useEffect } from 'react';

import { secureStorage } from '@/shared/storage/secureStorage';
import { useAppStore } from '@/store/appStore';

export function useBootstrap() {
  const setHydrated = useAppStore((state) => state.setHydrated);

  useEffect(() => {
    void (async () => {
      await secureStorage.get('authToken');
      setHydrated(true);
    })();
  }, [setHydrated]);
}
