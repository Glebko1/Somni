import { create } from 'zustand';

import { UserProfile } from '@/shared/types';

type AppState = {
  user: UserProfile | null;
  isHydrated: boolean;
  isLowEndDevice: boolean;
  setUser: (user: UserProfile | null) => void;
  setHydrated: (value: boolean) => void;
  setLowEndDevice: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isHydrated: false,
  isLowEndDevice: false,
  setUser: (user) => set({ user }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  setLowEndDevice: (isLowEndDevice) => set({ isLowEndDevice })
}));
