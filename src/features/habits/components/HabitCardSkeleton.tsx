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

interface HabitCardSkeletonProps {
  /** Stagger index — offsets the pulse start so cards shimmer in a cascade. */
  index: number;
}

export function HabitCardSkeleton({ index }: HabitCardSkeletonProps) {
  const { colors, radii } = useTheme();

  const opacity = useSharedValue(1);

  useEffect(() => {
    // Each card starts its pulse index * 160ms later, keeping them
    // permanently out of phase → cascading wave from top to bottom.
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

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const block = (width: ViewStyle['width'], height: number, borderRadius = radii.sm): ViewStyle => ({
    width,
    height,
    borderRadius,
    backgroundColor: colors.border,
  });

  return (
    <Animated.View style={[{ marginBottom: 10 }, animatedStyle]}>
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Emoji placeholder */}
        <View style={[block(44, 44, radii.md), { marginRight: 12 }]} />

        {/* Name + streak placeholders */}
        <View style={{ flex: 1, gap: 7 }}>
          <View style={block('58%', 13)} />
          <View style={block('36%', 10)} />
        </View>

        {/* Checkbox placeholder */}
        <View style={block(28, 28, radii.full)} />
      </Card>
    </Animated.View>
  );
}
