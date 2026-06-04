import { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/services/theme';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';

function useShimmerStyle(index: number) {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withDelay(
      index * 160,
      withRepeat(
        withSequence(
          withTiming(0.35, { duration: 650 }),
          withTiming(1.0, { duration: 650 }),
        ),
        -1,
      ),
    );
  }, [index, opacity]);
  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

function block(width: ViewStyle['width'], height: number, borderRadius: number, bg: string): ViewStyle {
  return { width, height, borderRadius, backgroundColor: bg };
}

/** Skeleton for one streak leaderboard row. */
function StreakRowSkeleton({ index }: { index: number }) {
  const { colors, radii, spacing } = useTheme();
  const shimmer = useShimmerStyle(index);
  const bg = colors.border;

  return (
    <Animated.View style={[{ marginBottom: spacing.sm }, shimmer]}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <View style={block(32, 32, radii.md, bg)} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={block('52%', 13, radii.sm, bg)} />
          <View style={block('34%', 10, radii.sm, bg)} />
        </View>
        <View style={block(22, 22, radii.full, bg)} />
      </Card>
    </Animated.View>
  );
}

const STREAK_ROWS = 4;

/** Full stats screen skeleton — mirrors the real layout so nothing shifts on reveal. */
export function StatsSkeleton() {
  const { colors, spacing, radii } = useTheme();
  const bg = colors.border;

  // Stat cards pulse together (indices 0-2), chart follows (3), streak rows cascade (4+)
  const cardShimmer0 = useShimmerStyle(0);
  const cardShimmer1 = useShimmerStyle(1);
  const cardShimmer2 = useShimmerStyle(2);
  const chartShimmer = useShimmerStyle(3);

  return (
    <View style={{ padding: spacing.lg }}>
      {/* Stat cards row */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl }}>
        {([cardShimmer0, cardShimmer1, cardShimmer2] as const).map((shimmer, i) => (
          <Animated.View key={i} style={[{ flex: 1 }, shimmer]}>
            <Card style={{ alignItems: 'center', paddingVertical: spacing.md, gap: spacing.xs }}>
              <View style={block(40, 40, 20, bg)} />
              <View style={block('55%', 18, radii.sm, bg)} />
              <View style={block('70%', 10, radii.sm, bg)} />
            </Card>
          </Animated.View>
        ))}
      </View>

      {/* Chart area */}
      <Text variant="heading" style={{ marginBottom: spacing.md }}>Last 7 Days</Text>
      <Animated.View style={[{ marginBottom: spacing.xl }, chartShimmer]}>
        <Card style={block('100%', 168, radii.lg, bg)} />
      </Animated.View>

      {/* Streaks heading */}
      <Text variant="heading" style={{ marginBottom: spacing.md }}>Streaks</Text>

      {/* Streak rows */}
      {Array.from({ length: STREAK_ROWS }, (_, i) => (
        <StreakRowSkeleton key={i} index={i + 4} />
      ))}
    </View>
  );
}
