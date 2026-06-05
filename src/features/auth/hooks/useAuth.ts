// production: replace signIn with OAuth/PKCE via expo-auth-session
import { useRouter } from 'expo-router';
import { deleteSecureItem, setSecureItem, removeItem, setItem } from '@/shared/storage';
import { queryClient } from '@/shared/api/queryClient';
import { SESSION_KEY, EMAIL_KEY } from '../constants';
import { useAuthStore } from '../store';

export function useAuth() {
  const { token, email, setToken, setEmail } = useAuthStore();
  const router = useRouter();

  async function signIn(rawEmail: string): Promise<void> {
    const normalised = rawEmail.trim().toLowerCase();
    const demoToken = `demo-${normalised}`;
    await Promise.all([
      setSecureItem(SESSION_KEY, demoToken),
      setItem(EMAIL_KEY, normalised),
    ]);
    // Set email before clearing cache so habitsStorageKey() resolves correctly
    // when hooks re-fetch after the cache is cleared.
    setEmail(normalised);
    setToken(demoToken);
    queryClient.clear(); // flush any cached data from a previous session
    router.replace('/(tabs)');
  }

  async function signOut(): Promise<void> {
    await Promise.all([
      deleteSecureItem(SESSION_KEY),
      removeItem(EMAIL_KEY),
    ]);
    queryClient.clear(); // flush cached data before clearing auth state
    setToken(null);
    setEmail(null);
    router.replace('/(auth)/welcome');
  }

  return { token, email, signIn, signOut };
}
