import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { today } from '@/shared/lib/date';
import { useTheme } from '@/services/theme';
import { Text } from '@/shared/ui/Text';
import type { DayData } from '../hooks/useStats';

const MAX_BAR_HEIGHT = 120;

function getDayLabel(dateStr: string): string {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return labels[new Date(`${dateStr}T00:00:00`).getDay()] ?? '';
}

interface BarColumnProps {
  data: DayData;
  maxCount: number;
  isToday: boolean;
  index: number;
}

function BarColumn({ data, maxCount, isToday, index }: BarColumnProps) {
  const { colors, radii, spacing } = useTheme();
  const targetHeight = maxCount > 0 ? Math.max((data.count / maxCount) * MAX_BAR_HEIGHT, data.count > 0 ? 6 : 0) : 0;
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withDelay(index * 70, withSpring(targetHeight, { damping: 14, stiffness: 120 }));
  }, [targetHeight, index, height]);

  const barStyle = useAnimatedStyle(() => ({ height: height.value }));

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {/* Bar */}
      <View style={{ height: MAX_BAR_HEIGHT, justifyContent: 'flex-end' }}>
        <Animated.View
          style={[
            barStyle,
            {
              width: '75%',
              backgroundColor: isToday ? colors.primary : `${colors.primary}50`,
              borderRadius: radii.sm,
            },
          ]}
        />
      </View>
      {/* Divider */}
      <View style={{ height: 1, width: '100%', backgroundColor: colors.border, marginVertical: spacing.xs }} />
      {/* Day label */}
      <Text
        variant="caption"
        style={{ color: isToday ? colors.primary : colors.textSecondary, fontWeight: isToday ? '700' : '400' }}
      >
        {getDayLabel(data.date)}
      </Text>
      {/* Count */}
      <Text variant="caption" style={{ color: colors.textSecondary }}>
        {data.count > 0 ? data.count : ''}
      </Text>
    </View>
  );
}

interface WeeklyChartProps {
  data: DayData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxCount = Math.max(1, ...data.map(d => d.count));
  const todayStr = today();

  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {data.map((day, i) => (
        <BarColumn
          key={day.date}
          data={day}
          maxCount={maxCount}
          isToday={day.date === todayStr}
          index={i}
        />
      ))}
    </View>
  );
}
