import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { type Habit } from '@/shared/api';
import { computeStreak, today } from '@/shared/lib/date';
import { useTheme } from '@/services/theme';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';

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
    checkScale.value = withSequence(
      withSpring(0.7, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 8, stiffness: 200 }),
    );
    onToggle();
  }

  // --- Streak badge spring entrance ---
  // Start at 1 if streak already exists (app load) so it doesn't animate in for every card on mount.
  const streakScale = useSharedValue(streak > 0 ? 1 : 0);
  useEffect(() => {
    streakScale.value = streak > 0
      ? withSpring(1, { damping: 10, stiffness: 150 })
      : withTiming(0, { duration: 150 });
  }, [streak, streakScale]);

  const streakStyle = useAnimatedStyle(() => ({
    opacity: streakScale.value,
    transform: [{ scale: streakScale.value }],
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
              {/* Emoji badge */}
              <View style={[styles.emoji, { backgroundColor: colors.background, borderRadius: radii.md }]}>
                <Text style={styles.emojiText}>{habit.emoji}</Text>
              </View>

              {/* Name + streak */}
              <View style={styles.info}>
                <Text variant="heading">{habit.name}</Text>
                {streak > 0 ? (
                  <Animated.View style={streakStyle}>
                    <Text variant="caption">
                      🔥 {streak} day{streak !== 1 ? 's' : ''}
                    </Text>
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
  emojiText: { fontSize: 26 },
  info: { flex: 1 },
  checkbox: { width: 28, height: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  deleteBackground: { alignItems: 'flex-end', justifyContent: 'center', paddingRight: 20 },
});
