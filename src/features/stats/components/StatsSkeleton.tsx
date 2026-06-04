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

// Must match WeeklyChart's MAX_BAR_HEIGHT so the chart skeleton
// is the exact same height as the real chart.
const BAR_HEIGHT = 120;

// Pre-set bar heights that look like realistic chart data.
const CHART_BARS = [45, 72, 55, 100, 80, 110, 60];

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

/**
 * Mirrors WeeklyChart's column layout exactly so the card height is
 * determined by the same structure — no manual height guessing.
 */
function ChartSkeleton({ shimmer }: { shimmer: ReturnType<typeof useShimmerStyle> }) {
  const { colors, radii, spacing } = useTheme();
  const bg = colors.border;

  return (
    <Animated.View style={[{ marginBottom: spacing.xl }, shimmer]}>
      <Card>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {CHART_BARS.map((barH, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              {/* Bar container — same fixed height as real WeeklyChart */}
              <View style={{ height: BAR_HEIGHT, justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
                <View style={block('70%', barH, radii.sm, bg)} />
              </View>
              {/* Divider — same as real chart */}
              <View style={{ height: 1, width: '100%', backgroundColor: bg, marginVertical: spacing.xs }} />
              {/* Day label placeholder — height matches caption text */}
              <View style={block(24, 11, radii.sm, bg)} />
            </View>
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}

/**
 * Streak row skeleton — placeholder heights match body + caption line
 * heights so the card is exactly the same height as a real streak row.
 */
function StreakRowSkeleton({ index }: { index: number }) {
  const { colors, radii, spacing } = useTheme();
  const shimmer = useShimmerStyle(index);
  const bg = colors.border;

  return (
    <Animated.View style={[{ marginBottom: spacing.sm }, shimmer]}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        {/* Emoji — fontSize 24 text has ~30px line height */}
        <View style={block(30, 30, radii.md, bg)} />
        {/* Text column — heights match body (16) + caption (12) line heights */}
        <View style={{ flex: 1, gap: 5 }}>
          <View style={block('55%', 16, radii.sm, bg)} />
          <View style={block('36%', 12, radii.sm, bg)} />
        </View>
        {/* Checkmark icon — matches Ionicons size={22} */}
        <View style={block(22, 22, radii.full, bg)} />
      </Card>
    </Animated.View>
  );
}

const STREAK_ROWS = 4;

export function StatsSkeleton() {
  const { colors, spacing, radii } = useTheme();
  const bg = colors.border;

  const cardShimmer0 = useShimmerStyle(0);
  const cardShimmer1 = useShimmerStyle(1);
  const cardShimmer2 = useShimmerStyle(2);
  const chartShimmer = useShimmerStyle(3);

  return (
    <View style={{ padding: spacing.lg }}>
      {/* Stat cards */}
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

      {/* Chart */}
      <Text variant="heading" style={{ marginBottom: spacing.md }}>Last 7 Days</Text>
      <ChartSkeleton shimmer={chartShimmer} />

      {/* Streak rows */}
      <Text variant="heading" style={{ marginBottom: spacing.md }}>Streaks</Text>
      {Array.from({ length: STREAK_ROWS }, (_, i) => (
        <StreakRowSkeleton key={i} index={i + 4} />
      ))}
    </View>
  );
}
