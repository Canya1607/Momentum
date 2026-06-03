import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { type Habit } from '@/shared/api';
import { computeStreak, today } from '@/shared/lib/date';
import { useTheme } from '@/services/theme';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onPress: () => void;
}

export function HabitCard({ habit, onToggle, onPress }: HabitCardProps) {
  const { colors, spacing, radii } = useTheme();
  const isCompleted = habit.completions.includes(today());
  const streak = computeStreak(habit.completions);

  return (
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
            <Text variant="caption">🔥 {streak} day{streak !== 1 ? 's' : ''}</Text>
          ) : (
            <Text variant="caption" color={colors.textSecondary}>Start today</Text>
          )}
        </View>

        {/* Completion toggle */}
        <TouchableOpacity
          onPress={onToggle}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: isCompleted ? colors.primary : colors.border,
                backgroundColor: isCompleted ? colors.primary : 'transparent',
                borderRadius: radii.full,
              },
            ]}
          >
            {isCompleted && (
              <Ionicons name="checkmark" size={16} color={colors.textInverse} />
            )}
          </View>
        </TouchableOpacity>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  emoji: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  emojiText: { fontSize: 26 },
  info: { flex: 1 },
  checkbox: { width: 28, height: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
