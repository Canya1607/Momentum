// production: replace signIn with OAuth/PKCE via expo-auth-session
import { useRouter } from 'expo-router';
import { deleteSecureItem, setSecureItem, removeItem, setItem } from '@/shared/storage';
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
    setToken(demoToken);
    setEmail(normalised);
    router.replace('/(tabs)');
  }

  async function signOut(): Promise<void> {
    await Promise.all([
      deleteSecureItem(SESSION_KEY),
      removeItem(EMAIL_KEY),
    ]);
    setToken(null);
    setEmail(null);
    router.replace('/(auth)/sign-in');
  }

  return { token, email, signIn, signOut };
}
