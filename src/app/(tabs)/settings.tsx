import { DEMO_MODE } from '@/config';
import { useAuth, AvatarPicker } from '@/features/auth';
import { HABITS_KEY, seedDemoHabits } from '@/features/habits';
import { ENTITLEMENT_KEY, useEntitlement, useRestorePurchases } from '@/features/subscription';
import { setMockEntitlement } from '@/services/purchases';
import { useTheme, useThemeStore } from '@/services/theme';
import { confirmAlert, infoAlert } from '@/shared/lib/alert';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Screen } from '@/shared/ui/Screen';
import { Text } from '@/shared/ui/Text';
import { useQueryClient } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';

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
    await setMockEntitlement('Free');
    queryClient.invalidateQueries({ queryKey: ENTITLEMENT_KEY });
    infoAlert('Reset', 'Subscription reset to Free.');
  }

  async function handleSetPro() {
    await setMockEntitlement('Pro');
    queryClient.invalidateQueries({ queryKey: ENTITLEMENT_KEY });
    infoAlert('Upgraded', 'Subscription set to Pro.');
  }

  async function handleSeed(plan: 'Free' | 'Pro') {
    await seedDemoHabits(plan);
    queryClient.invalidateQueries({ queryKey: HABITS_KEY });
    infoAlert('Seeded', `${plan === 'Pro' ? '7' : '3'} demo habits loaded with varied streaks.`);
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
    <Screen padded scroll style={{ paddingBottom: spacing.xxl }}>
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
            <Text variant="body" style={{ color: entitlement === 'Pro' ? colors.primary : colors.text, fontWeight: '600' }}>
              {entitlement === 'Pro' ? 'Momentum Pro' : entitlement === 'Free' ? 'Free' : '…'}
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
                  variant={entitlement === 'Free' ? 'primary' : 'secondary'}
                  onPress={handleSetFree}
                  disabled={entitlement === 'Free'}
                />
              </View>
              <View style={{ width: spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Button
                  label="Set Pro"
                  variant={entitlement === 'Pro' ? 'primary' : 'secondary'}
                  onPress={handleSetPro}
                  disabled={entitlement === 'Pro'}
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
                  onPress={() => handleSeed('Free')}
                />
              </View>
              <View style={{ width: spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Button
                  label="7 Pro habits"
                  variant="secondary"
                  onPress={() => handleSeed('Pro')}
                />
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Account */}
      <View style={{ paddingBottom: spacing.xl }}>
        <SectionLabel label="Account" />
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
            <AvatarPicker />
            {!!email && (
              <View style={{ flex: 1 }}>
                <Text variant="caption" style={{ color: colors.textSecondary, marginBottom: 2 }}>
                  Signed in as
                </Text>
                <Text variant="body" style={{ color: colors.text, fontWeight: '600' }} numberOfLines={1}>
                  {email}
                </Text>
              </View>
            )}
          </View>
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
