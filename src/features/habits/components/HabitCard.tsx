import { useTheme } from '@/services/theme';
import { type Habit } from '@/shared/api';
import { computeStreak, today } from '@/shared/lib/date';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { impact, notification } from 'momentum-haptics';
import { useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const DELETE_THRESHOLD = 100; // px of left swipe to trigger delete

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onPress: () => void;
  onDelete?: () => void;
}

export function HabitCard({ habit, onToggle, onPress, onDelete }: HabitCardProps) {
  const { colors, radii } = useTheme();
  const isCompleted = habit.completions.includes(today());
  const streak = computeStreak(habit.completions);

  // --- Checkbox spring ---
  const checkScale = useSharedValue(1);
  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  function handleToggle() {
    cancelAnimation(checkScale);
    checkScale.value = withSequence(
      withTiming(0.75, { duration: 70 }),
      withSpring(1, { damping: 20, stiffness: 300 }),
    );
    // Completing a habit → success notification tap; unchecking → light impact
    if (!isCompleted) {
      notification('success');
    } else {
      impact('light');
    }
    onToggle();
  }

  // --- Streak badge fade ---
  // Opacity only — no scale so the text fades in-place without shifting layout.
  const streakOpacity = useSharedValue(streak > 0 ? 1 : 0);
  useEffect(() => {
    streakOpacity.value = streak > 0
      ? withTiming(1, { duration: 180 })
      : withTiming(0, { duration: 120 });
  }, [streak, streakOpacity]);

  const streakStyle = useAnimatedStyle(() => ({
    opacity: streakOpacity.value,
  }));

  // --- Swipe-to-delete ---
  const translateX = useSharedValue(0);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const deleteRevealStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -DELETE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const triggerDelete = useCallback(() => { onDelete?.(); }, [onDelete]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate(e => {
      // only allow swiping left
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd(e => {
      if (e.translationX < -DELETE_THRESHOLD && onDelete) {
        translateX.value = withTiming(-500, { duration: 250 }, () => {
          runOnJS(triggerDelete)();
        });
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

  return (
    <View style={styles.container}>
      {/* Red background revealed as the card slides left */}
      {onDelete && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.deleteBackground,
            { backgroundColor: colors.danger, borderRadius: radii.lg },
            deleteRevealStyle,
          ]}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </Animated.View>
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardStyle}>
          <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card style={styles.card}>
              {/* Icon badge */}
              <View style={[styles.emoji, { backgroundColor: `${colors.primary}15`, borderRadius: radii.md }]}>
                <Ionicons name={habit.emoji as IoniconName} size={24} color={colors.primary} />
              </View>

              {/* Name + streak */}
              <View style={styles.info}>
                <Text variant="heading">{habit.name}</Text>
                {streak > 0 ? (
                  <Animated.View style={[streakStyle, { flexDirection: 'row', alignItems: 'center', gap: 3 }]}>
                    <Ionicons name="flame" size={12} color="#f97316" />
                    <Text variant="caption">{streak} day{streak !== 1 ? 's' : ''}</Text>
                  </Animated.View>
                ) : (
                  <Text variant="caption" color={colors.textSecondary}>Start today</Text>
                )}
              </View>

              {/* Completion checkbox */}
              <TouchableOpacity
                onPress={handleToggle}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Animated.View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isCompleted ? colors.primary : colors.border,
                      backgroundColor: isCompleted ? colors.primary : 'transparent',
                      borderRadius: radii.full,
                    },
                    checkStyle,
                  ]}
                >
                  {isCompleted && (
                    <Ionicons name="checkmark" size={16} color={colors.textInverse} />
                  )}
                </Animated.View>
              </TouchableOpacity>
            </Card>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center' },
  emoji: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  checkbox: { width: 28, height: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  deleteBackground: { alignItems: 'flex-end', justifyContent: 'center', paddingRight: 20 },
});
