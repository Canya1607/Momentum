import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { getSecureItem } from '@/shared/storage';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useAuthStore, SESSION_KEY } from '@/features/auth';
import { ThemeProvider, useTheme } from '@/services/theme';
import { queryClient } from '@/shared/api/queryClient';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const { token, isLoading, setToken, setLoading } = useAuthStore();

  // Hydrate the Zustand store from SecureStore once on mount
  useEffect(() => {
    getSecureItem(SESSION_KEY)
      .then(t => { setToken(t); setLoading(false); })
      .catch(() => { setToken(null); setLoading(false); });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (token === null && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (token !== null && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, isLoading, segments, router]);

  // Keep screen blank while auth state is resolving to avoid flash
  if (isLoading) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="paywall"
        options={{ presentation: 'modal', title: 'Momentum Pro' }}
      />
      <Stack.Screen
        name="habit/[id]"
        options={{ title: 'Habit', headerBackTitle: 'Back' }}
      />
    </Stack>
  );
}
