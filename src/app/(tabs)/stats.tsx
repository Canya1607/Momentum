import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEntitlement } from '@/features/subscription';
import { useTheme } from '@/services/theme';
import { Button } from '@/shared/ui/Button';
import { Screen } from '@/shared/ui/Screen';
import { Text } from '@/shared/ui/Text';

export default function StatsScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { data: entitlement, isLoading } = useEntitlement();

  if (isLoading) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (entitlement !== 'pro') {
    return (
      <Screen padded>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: `${colors.primary}18`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.sm,
            }}
          >
            <Ionicons name="lock-closed" size={32} color={colors.primary} />
          </View>
          <Text variant="heading" style={{ textAlign: 'center' }}>
            Stats is a Pro feature
          </Text>
          <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Upgrade to track streaks, completion rates, and habit trends over time.
          </Text>
          <Button
            label="Upgrade to Pro"
            onPress={() => router.push('/paywall')}
            style={{ marginTop: spacing.sm, alignSelf: 'stretch' }}
          />
        </View>
      </Screen>
    );
  }

  // Pro content — charts added in Task 13
  return (
    <Screen padded>
      <Text variant="display" style={{ marginBottom: spacing.xl }}>Stats</Text>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="body" style={{ color: colors.textSecondary }}>
          Charts coming soon.
        </Text>
      </View>
    </Screen>
  );
}
