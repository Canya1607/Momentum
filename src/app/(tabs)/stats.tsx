import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEntitlement } from '@/features/subscription';
import { useStats, StatCard, WeeklyChart } from '@/features/stats';
import { useTheme } from '@/services/theme';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Screen } from '@/shared/ui/Screen';
import { Text } from '@/shared/ui/Text';

export default function StatsScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { data: entitlement, isLoading } = useEntitlement();
  const stats = useStats();

  if (isLoading) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (entitlement !== 'pro') {
    return (
      <Screen padded>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: `${colors.primary}18`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.sm,
            }}
          >
            <Ionicons name="lock-closed" size={32} color={colors.primary} />
          </View>
          <Text variant="heading" style={{ textAlign: 'center' }}>
            Stats is a Pro feature
          </Text>
          <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Upgrade to track streaks, completion rates, and habit trends over time.
          </Text>
          <Button
            label="Upgrade to Pro"
            onPress={() => router.push('/paywall')}
            style={{ marginTop: spacing.sm, alignSelf: 'stretch' }}
          />
        </View>
      </Screen>
    );
  }

  const { completedToday, totalHabits, totalCompletions, bestStreak, last7Days, habitsByStreak } = stats;

  return (
    <Screen padded={false} scroll>
      <View style={{ padding: spacing.lg }}>
        <Text variant="display" style={{ marginBottom: spacing.xl }}>Stats</Text>

        {/* Summary row */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl }}>
          <StatCard icon="checkmark-circle-outline" label="Today" value={`${completedToday}/${totalHabits}`} />
          <StatCard icon="flame-outline" label="Best streak" value={bestStreak} />
          <StatCard icon="trophy-outline" label="Total done" value={totalCompletions} />
        </View>

        {/* Weekly bar chart */}
        <Text variant="heading" style={{ marginBottom: spacing.md }}>Last 7 Days</Text>
        <Card style={{ marginBottom: spacing.xl }}>
          <WeeklyChart data={last7Days} />
        </Card>

        {/* Streaks leaderboard */}
        {habitsByStreak.length > 0 && (
          <>
            <Text variant="heading" style={{ marginBottom: spacing.md }}>Streaks</Text>
            {habitsByStreak.map(habit => (
              <Card
                key={habit.id}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm }}
              >
                <Text style={{ fontSize: 24 }}>{habit.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="body">{habit.name}</Text>
                  <Text variant="caption" style={{ color: colors.textSecondary }}>
                    {habit.streak > 0
                      ? `🔥 ${habit.streak} day${habit.streak !== 1 ? 's' : ''}`
                      : 'No streak yet'}
                  </Text>
                </View>
                {habit.completedToday && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                )}
              </Card>
            ))}
          </>
        )}

        {totalHabits === 0 && (
          <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
            <Text variant="body" style={{ color: colors.textSecondary }}>
              Add some habits to see your stats here.
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}
