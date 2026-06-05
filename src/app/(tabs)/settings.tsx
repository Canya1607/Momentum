import { useQueryClient } from '@tanstack/react-query';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/features/auth';
import { seedDemoHabits, HABITS_KEY } from '@/features/habits';
import { useEntitlement, useRestorePurchases, ENTITLEMENT_KEY } from '@/features/subscription';
import { setMockEntitlement } from '@/services/purchases';
import { useTheme, useThemeStore } from '@/services/theme';
import { DEMO_MODE } from '@/config';
import { confirmAlert, infoAlert } from '@/shared/lib/alert';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Screen } from '@/shared/ui/Screen';
import { Text } from '@/shared/ui/Text';

function SectionLabel({ label }: { label: string }) {
  const { colors, spacing } = useTheme();
  return (
    <Text
      variant="label"
      style={{ color: colors.textSecondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 }}
    >
      {label}
    </Text>
  );
}

export default function SettingsScreen() {
  const { colors, spacing } = useTheme();
  const queryClient = useQueryClient();
  const { data: entitlement } = useEntitlement();
  const { mutateAsync: restore, isPending: restoring } = useRestorePurchases();
  const { signOut, email } = useAuth();
  const { preference, setPreference } = useThemeStore();

  async function handleSetFree() {
    await setMockEntitlement('free');
    queryClient.invalidateQueries({ queryKey: ENTITLEMENT_KEY });
    infoAlert('Reset', 'Subscription reset to Free.');
  }

  async function handleSetPro() {
    await setMockEntitlement('pro');
    queryClient.invalidateQueries({ queryKey: ENTITLEMENT_KEY });
    infoAlert('Upgraded', 'Subscription set to Pro.');
  }

  async function handleSeed(plan: 'free' | 'pro') {
    await seedDemoHabits(plan);
    queryClient.invalidateQueries({ queryKey: HABITS_KEY });
    infoAlert('Seeded', `${plan === 'pro' ? '7' : '3'} demo habits loaded with varied streaks.`);
  }

  async function handleRestore() {
    try {
      await restore();
      infoAlert('Restored', 'Your purchases have been restored.');
    } catch {
      infoAlert('Error', 'Could not restore purchases. Please try again.');
    }
  }

  return (
    <Screen padded scroll style={{ paddingBottom: spacing.xxl * 2 }}>
      <Text variant="display" style={{ marginBottom: spacing.xl }}>Settings</Text>

      {/* Appearance */}
      <View style={{ marginBottom: spacing.xl }}>
        <SectionLabel label="Appearance" />
        <Card>
          <View style={styles.row}>
            {([
              { label: 'Light',  value: 'light'  },
              { label: 'Auto',   value: 'system' },
              { label: 'Dark',   value: 'dark'   },
            ] as const).map(({ label, value }, i, arr) => (
              <View key={value} style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Button
                    label={label}
                    variant={preference === value ? 'primary' : 'secondary'}
                    onPress={() => setPreference(value)}
                  />
                </View>
                {i < arr.length - 1 && <View style={{ width: spacing.sm }} />}
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Subscription */}
      <View style={{ marginBottom: spacing.xl }}>
        <SectionLabel label="Subscription" />
        <Card>
          <Text variant="body" style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
            Current plan:{' '}
            <Text variant="body" style={{ color: entitlement === 'pro' ? colors.primary : colors.text, fontWeight: '600' }}>
              {entitlement === 'pro' ? 'Momentum Pro' : entitlement ?? '…'}
            </Text>
          </Text>
          <Button
            label={restoring ? 'Restoring…' : 'Restore Purchases'}
            variant="secondary"
            onPress={handleRestore}
            loading={restoring}
          />
        </Card>
      </View>

      {/* Developer — only visible when DEMO_MODE is on */}
      {DEMO_MODE && (
        <View style={{ marginBottom: spacing.xl }}>
          <SectionLabel label="Developer" />
          <Card>
            <Text variant="caption" style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
              Toggle mock entitlement without going through the paywall.
            </Text>
            <Text variant="caption" style={{ color: colors.textSecondary, marginBottom: spacing.sm }}>
              Subscription
            </Text>
            <View style={[styles.row, { marginBottom: spacing.md }]}>
              <View style={{ flex: 1 }}>
                <Button
                  label="Set Free"
                  variant={entitlement === 'free' ? 'primary' : 'secondary'}
                  onPress={handleSetFree}
                  disabled={entitlement === 'free'}
                />
              </View>
              <View style={{ width: spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Button
                  label="Set Pro"
                  variant={entitlement === 'pro' ? 'primary' : 'secondary'}
                  onPress={handleSetPro}
                  disabled={entitlement === 'pro'}
                />
              </View>
            </View>

            <Text variant="caption" style={{ color: colors.textSecondary, marginBottom: spacing.sm }}>
              Seed habits (replaces existing)
            </Text>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Button
                  label="3 Free habits"
                  variant="secondary"
                  onPress={() => handleSeed('free')}
                />
              </View>
              <View style={{ width: spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Button
                  label="7 Pro habits"
                  variant="secondary"
                  onPress={() => handleSeed('pro')}
                />
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Account */}
      <View>
        <SectionLabel label="Account" />
        <Card>
          {!!email && (
            <Text variant="body" style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
              Signed in as{' '}
              <Text variant="body" style={{ color: colors.text, fontWeight: '600' }}>
                {email}
              </Text>
            </Text>
          )}
          <Button
            label="Sign Out"
            variant="secondary"
            onPress={() =>
              confirmAlert({
                title: 'Sign Out',
                message: 'Are you sure you want to sign out?',
                confirmLabel: 'Sign Out',
                onConfirm: signOut,
              })
            }
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
});
