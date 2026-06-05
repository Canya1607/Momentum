/**
 * Sign-in screen — reached from the welcome onboarding carousel.
 * Reanimated entrance: slide-up + fade (same pattern as paywall.tsx).
 * Auth logic is unchanged: mocked sign-in, any email works.
 * production: replace with OAuth/PKCE via expo-auth-session
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth';
import { useTheme } from '@/services/theme';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';

export default function SignInScreen() {
  const { colors, spacing, radii, typography } = useTheme();
  const { signIn } = useAuth();
  const router = useRouter();
  const { returning } = useLocalSearchParams<{ returning?: string }>();
  const isReturning = returning === '1';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  // Entrance animation — same pattern as paywall.tsx
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);
  useEffect(() => {
    translateY.value = withSpring(0, { damping: 50, stiffness: 216 });
    opacity.value = withTiming(1, { duration: 350 });
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  async function handleSignIn() {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Back arrow */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { padding: spacing.md }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>

        {/* Animated content */}
        <Animated.View style={[styles.inner, { paddingHorizontal: spacing.xl }, animatedStyle]}>
          {/* Logo mark */}
          <Text variant="label" style={{ color: colors.primary, fontWeight: '700', marginBottom: spacing.sm }}>
            ✦ Momentum
          </Text>

          <Text variant="display" style={{ marginBottom: spacing.xs }}>
            {isReturning ? 'Welcome back.' : "Let's get started."}
          </Text>
          <Text variant="body" style={{ color: colors.textSecondary, marginBottom: spacing.xl }}>
            {isReturning ? 'Enter your email to continue.' : 'Enter your email to create your account.'}
          </Text>

          {/* Email input inside a Card — card border reacts to focus/error state */}
          <Card
            style={{
              marginBottom: spacing.md,
              borderColor: focused ? colors.primary : error ? colors.danger : colors.border,
              borderWidth: focused || !!error ? 2 : 1,
            }}
          >
            <Text variant="label" style={{ color: colors.textSecondary, marginBottom: spacing.xs }}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  fontSize: typography.size.md,
                  paddingVertical: spacing.xs,
                },
              ]}
              value={email}
              onChangeText={text => { setEmail(text); if (error) setError(''); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="you@example.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleSignIn}
            />
          </Card>

          {!!error && (
            <Text variant="caption" style={{ color: colors.danger, marginBottom: spacing.md, marginTop: -spacing.xs }}>
              {error}
            </Text>
          )}

          <Button label="Sign In" onPress={handleSignIn} loading={loading} />

          <Text variant="caption" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl }}>
            Demo mode — any email works.
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backButton: { alignSelf: 'flex-start' },
  inner: { flex: 1, justifyContent: 'center' },
  input: { width: '100%' },
});
