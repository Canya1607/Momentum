/**
 * Paywall screen — modal route registered in _layout.tsx.
 * All purchase logic flows through purchasesService (never imports mock/storekit directly).
 * Reanimated entrance animation added in Task 12.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEntitlement, useOfferings, usePurchase, useRestorePurchases } from '@/features/subscription';
import { infoAlert } from '@/shared/lib/alert';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Screen } from '@/shared/ui/Screen';
import { Text } from '@/shared/ui/Text';
import { useTheme } from '@/services/theme';
import type { Offering } from '@/services/purchases';

const PRO_FEATURES: { icon: string; label: string }[] = [
  { icon: 'infinite-outline', label: 'Unlimited habits' },
  { icon: 'bar-chart-outline', label: 'Stats & insights' },
  { icon: 'color-palette-outline', label: 'Custom themes' },
];

export default function PaywallScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();

  const { data: entitlement } = useEntitlement();
  const { data: offerings = [], isLoading: loadingOfferings } = useOfferings();
  const { mutateAsync: purchase, isPending: purchasing } = usePurchase();
  const { mutateAsync: restore, isPending: restoring } = useRestorePurchases();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const effectiveSelected = selectedId ?? offerings[0]?.productId ?? null;

  // Slide-up + fade entrance when modal opens
  const translateY = useSharedValue(60);
  const opacity = useSharedValue(0);
  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 180 });
    opacity.value = withTiming(1, { duration: 350 });
  }, []);
  const entranceStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  async function handlePurchase() {
    if (!effectiveSelected) return;
    try {
      const result = await purchase(effectiveSelected);
      if (result.status === 'purchased') {
        infoAlert('Welcome to Pro!', 'Your subscription is now active.');
        router.back();
      } else if (result.status === 'error') {
        infoAlert('Purchase Failed', result.message);
      }
      // status === 'cancelled': user dismissed the sheet, no alert needed
    } catch {
      infoAlert('Error', 'Something went wrong. Please try again.');
    }
  }

  async function handleRestore() {
    try {
      await restore();
      infoAlert('Restored', 'Your purchases have been restored.');
    } catch {
      infoAlert('Error', 'Could not restore purchases. Please try again.');
    }
  }

  if (entitlement === 'pro') {
    return (
      <Screen padded>
        <View style={styles.alreadyProContainer}>
          <Text variant="heading" style={{ color: colors.primary, marginBottom: spacing.sm, textAlign: 'center' }}>
            You're already a Pro member ✓
          </Text>
          <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl }}>
            Enjoy unlimited habits, stats, and custom themes.
          </Text>
          <Button label="Close" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false} scroll>
      <Animated.View style={[{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl }, entranceStyle]}>

        {/* Hero */}
        <Text variant="display" style={{ textAlign: 'center', marginBottom: spacing.xs }}>
          Momentum Pro
        </Text>
        <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl }}>
          Build habits without limits.
        </Text>

        {/* Feature list */}
        <View style={{ marginBottom: spacing.xl, gap: spacing.sm }}>
          {PRO_FEATURES.map(({ icon, label }) => (
            <View key={label} style={styles.featureRow}>
              <View style={[styles.iconBadge, { backgroundColor: `${colors.primary}18` }]}>
                <Ionicons name={icon as 'infinite-outline'} size={20} color={colors.primary} />
              </View>
              <Text variant="body" style={{ color: colors.text }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Offerings */}
        {loadingOfferings ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
        ) : (
          <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
            {offerings.map(offering => (
              <OfferingCard
                key={offering.productId}
                offering={offering}
                selected={effectiveSelected === offering.productId}
                onSelect={() => setSelectedId(offering.productId)}
              />
            ))}
          </View>
        )}

        {/* CTA */}
        <Button
          label={purchasing ? 'Processing…' : 'Get Pro'}
          onPress={handlePurchase}
          disabled={!effectiveSelected || purchasing || restoring}
          loading={purchasing}
          style={{ marginBottom: spacing.md }}
        />

        {/* Restore */}
        <TouchableOpacity
          onPress={handleRestore}
          disabled={restoring}
          style={{ alignItems: 'center', padding: spacing.sm }}
        >
          <Text variant="caption" style={{ color: colors.textSecondary }}>
            {restoring ? 'Restoring…' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Screen>
  );
}

interface OfferingCardProps {
  offering: Offering;
  selected: boolean;
  onSelect: () => void;
}

function OfferingCard({ offering, selected, onSelect }: OfferingCardProps) {
  const { colors, spacing } = useTheme();
  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
      <Card
        style={{
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: selected ? 2 : 1,
        }}
      >
        <View style={styles.offeringRow}>
          <View style={{ flex: 1, marginRight: spacing.md }}>
            <Text variant="heading" style={{ color: colors.text, marginBottom: 2 }}>
              {offering.title}
            </Text>
            <Text variant="caption" style={{ color: colors.textSecondary }}>
              {offering.description}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant="label" style={{ color: colors.primary, fontWeight: '700' }}>
              {offering.price}
            </Text>
            {selected && (
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.primary}
                style={{ marginTop: 4 }}
              />
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  alreadyProContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBadge: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  offeringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
