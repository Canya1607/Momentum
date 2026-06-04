import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  token: null,
  isLoading: true,
  setToken: token => set({ token }),
  setLoading: isLoading => set({ isLoading }),
}));
