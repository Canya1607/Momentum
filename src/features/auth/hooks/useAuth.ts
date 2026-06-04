// production: replace signIn with OAuth/PKCE via expo-auth-session
import { useRouter } from 'expo-router';
import { deleteSecureItem, setSecureItem } from '@/shared/storage';
import { SESSION_KEY } from '../constants';
import { useAuthStore } from '../store';

export function useAuth() {
  const { token, setToken } = useAuthStore();
  const router = useRouter();

  async function signIn(email: string): Promise<void> {
    const demoToken = `demo-${email.trim().toLowerCase()}`;
    await setSecureItem(SESSION_KEY, demoToken);
    setToken(demoToken);
    router.replace('/(tabs)');
  }

  async function signOut(): Promise<void> {
    await deleteSecureItem(SESSION_KEY);
    setToken(null);
    router.replace('/(auth)/sign-in');
  }

  return { token, signIn, signOut };
}
