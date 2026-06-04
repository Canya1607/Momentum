import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { useAuth } from '@/features/auth';
import { useTheme } from '@/services/theme';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

export default function SignInScreen() {
  const { colors, spacing, radii, typography } = useTheme();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

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
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.inner, { padding: spacing.xl }]}>
        {/* Hero */}
        <Text variant="display" style={styles.logo}>Momentum</Text>
        <Text variant="body" style={{ color: colors.textSecondary, marginBottom: spacing.xxl }}>
          Build habits that stick.
        </Text>

        {/* Email input */}
        <Text variant="label" style={{ color: colors.textSecondary, marginBottom: spacing.xs }}>
          Email
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: focused ? colors.primary : error ? colors.danger : colors.border,
              borderRadius: radii.lg,
              color: colors.text,
              fontSize: typography.size.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm + 2,
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
        {!!error && (
          <Text variant="caption" style={{ color: colors.danger, marginTop: spacing.xs }}>
            {error}
          </Text>
        )}

        <Button
          label="Sign In"
          onPress={handleSignIn}
          loading={loading}
          style={{ marginTop: spacing.lg }}
        />

        {/* Demo note */}
        <Text variant="caption" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl }}>
          Demo mode — any email works.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center' },
  logo: { marginBottom: 8 },
  input: { borderWidth: 1.5 },
});
