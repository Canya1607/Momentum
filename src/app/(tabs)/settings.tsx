import { useQueryClient } from '@tanstack/react-query';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/features/auth';
import { useEntitlement, ENTITLEMENT_KEY } from '@/features/subscription';
import { setMockEntitlement } from '@/services/purchases';
import { useTheme } from '@/services/theme';
import { DEMO_MODE } from '@/config';
import { confirmAlert, infoAlert } from '@/shared/lib/alert';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Screen } from '@/shared/ui/Screen';
import { Text } from '@/shared/ui/Text';

export default function SettingsScreen() {
  const { colors, spacing } = useTheme();
  const queryClient = useQueryClient();
  const { data: entitlement } = useEntitlement();
  const { signOut, email } = useAuth();

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

  return (
    <Screen padded scroll>
      <Text variant="display" style={{ marginBottom: spacing.xl }}>Settings</Text>

      {/* Dev tools — only visible when DEMO_MODE is on */}
      {DEMO_MODE && (
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            variant="label"
            style={{ color: colors.textSecondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Developer
          </Text>
          <Card>
            <Text variant="body" style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
              Current plan:{' '}
              <Text variant="body" style={{ color: entitlement === 'pro' ? colors.primary : colors.text, fontWeight: '600' }}>
                {entitlement ?? '…'}
              </Text>
            </Text>
            <View style={styles.row}>
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
          </Card>
        </View>
      )}

      {/* Account */}
      <View>
        <Text
          variant="label"
          style={{ color: colors.textSecondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 }}
        >
          Account
        </Text>
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
            variant="ghost"
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
