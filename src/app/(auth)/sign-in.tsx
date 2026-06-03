import { useRouter } from 'expo-router';
import { setSecureItem } from '@/shared/storage';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/services/theme';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

// production: replace with OAuth/PKCE via expo-auth-session
const SESSION_KEY = 'session_token';

export default function SignInScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();

  async function handleSignIn() {
    await setSecureItem(SESSION_KEY, 'demo-token');
    router.replace('/(tabs)');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <Text variant="display" style={styles.logo}>Momentum</Text>
      <Text variant="body" color={colors.textSecondary} style={styles.subtitle}>
        Build habits that stick.
      </Text>
      <Button label="Sign In (Demo)" onPress={handleSignIn} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { marginBottom: 8 },
  subtitle: { marginBottom: 48 },
  button: { width: '100%' },
});
