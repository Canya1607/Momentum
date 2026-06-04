import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  email: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setEmail: (email: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  token: null,
  email: null,
  isLoading: true,
  setToken: token => set({ token }),
  setEmail: email => set({ email }),
  setLoading: isLoading => set({ isLoading }),
}));
