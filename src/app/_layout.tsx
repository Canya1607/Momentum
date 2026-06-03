import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/services/theme';
import { queryClient } from '@/shared/api/queryClient';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

SplashScreen.preventAutoHideAsync();

// production: replace 'session_token' key with a constant from features/auth
const SESSION_KEY = 'session_token';

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

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

function RootNavigator() {
  const { colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    SecureStore.getItemAsync(SESSION_KEY)
      .then(token => setAuthState(token != null ? 'authenticated' : 'unauthenticated'))
      .catch(() => setAuthState('unauthenticated'));
  }, []);

  useEffect(() => {
    if (authState === 'loading') return;
    const inAuthGroup = segments[0] === '(auth)';
    if (authState === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (authState === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [authState, segments, router]);

  // Keep screen blank while auth state is resolving to avoid flash
  if (authState === 'loading') return null;

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
