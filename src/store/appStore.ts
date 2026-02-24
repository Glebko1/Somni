import { create } from 'zustand';

import { UserProfile } from '@/shared/types';

type AppState = {
  user: UserProfile | null;
  isHydrated: boolean;
  setUser: (user: UserProfile | null) => void;
  setHydrated: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  setHydrated: (isHydrated) => set({ isHydrated })
}));
