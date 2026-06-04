import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/services/theme';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  /** Optional text shown after the animated number, e.g. "/7" for Today. */
  suffix?: string;
  /** Stagger index — each card delays by index * 80ms. */
  index?: number;
}

/** Counts from 0 to target with a cubic ease-out over ~700ms. */
function useCountUp(target: number): number {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (target === 0) { setCurrent(0); return; }
    const steps = 30;
    const stepMs = 700 / steps;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setCurrent(Math.round(eased * target));
      if (step >= steps) clearInterval(id);
    }, stepMs);
    return () => clearInterval(id);
  }, [target]);
  return current;
}

export function StatCard({ icon, label, value, suffix, index = 0 }: StatCardProps) {
  const { colors, spacing } = useTheme();
  const displayValue = useCountUp(value);

  // Staggered card entrance: scale up + fade in
  const scale = useSharedValue(0.82);
  const opacity = useSharedValue(0);
  useEffect(() => {
    const delay = index * 80;
    scale.value = withDelay(delay, withSpring(1, { damping: 16, stiffness: 220 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 250 }));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={cardStyle}>
      <Card style={{ alignItems: 'center', paddingVertical: spacing.md }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${colors.primary}18`,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.xs,
          }}
        >
          <Ionicons name={icon as 'star'} size={20} color={colors.primary} />
        </View>

        {/* Animated number + optional suffix */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text variant="heading" style={{ color: colors.text }}>
            {displayValue}
          </Text>
          {!!suffix && (
            <Text variant="body" style={{ color: colors.textSecondary }}>
              {suffix}
            </Text>
          )}
        </View>

        <Text variant="caption" style={{ color: colors.textSecondary, textAlign: 'center' }}>
          {label}
        </Text>
      </Card>
    </Animated.View>
  );
}
