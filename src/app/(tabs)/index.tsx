import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { HabitCard, HabitCardSkeleton, EmptyState, useHabits, useToggleCompletion, useDeleteHabit, seedDemoHabits, HABITS_KEY } from '@/features/habits';
import { useEntitlement } from '@/features/subscription';
import { useTheme } from '@/services/theme';
import { FREE_HABIT_LIMIT } from '@/config';
import { Screen } from '@/shared/ui/Screen';
import { Text } from '@/shared/ui/Text';

const SKELETON_COUNT = 3;
const MIN_LOADING_MS = 900;

export default function HabitListScreen() {
  const { colors, spacing, radii } = useTheme();
  const router = useRouter();
  const { data: habits, isLoading } = useHabits();
  const { mutate: toggle } = useToggleCompletion();
  const { mutate: remove } = useDeleteHabit();
  const { data: entitlement } = useEntitlement();
  const queryClient = useQueryClient();

  const [minLoadDone, setMinLoadDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMinLoadDone(true), MIN_LOADING_MS);
    return () => clearTimeout(t);
  }, []);
  const showSkeleton = isLoading || !minLoadDone;

  const isPro = entitlement === 'Pro';
  const atFreeLimit = !isPro && (habits?.length ?? 0) >= FREE_HABIT_LIMIT;

  function handleAdd() {
    if (atFreeLimit) {
      router.push('/paywall');
    } else {
      router.push('/habit/new');
    }
  }

  // FAB press spring
  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  function handleFabPress() {
    fabScale.value = withSpring(0.88, { damping: 12, stiffness: 300 }, () => {
      fabScale.value = withSpring(1, { damping: 8, stiffness: 200 });
    });
    handleAdd();
  }

  if (showSkeleton) {
    return (
      <Screen padded={false}>
        <View style={{ padding: spacing.lg }}>
          <Text variant="display" style={{ marginBottom: spacing.xl }}>Habits</Text>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <HabitCardSkeleton key={i} index={i} />
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: 96,
          flexGrow: 1,
          justifyContent: habits?.length === 0 ? 'center' : 'flex-start',
        }}
        ListHeaderComponent={
          habits && habits.length > 0
            ? <Text variant="display" style={{ marginBottom: spacing.xl }}>Habits</Text>
            : null
        }
        ListEmptyComponent={
          <EmptyState
            onAdd={handleAdd}
            onSeedData={async () => {
              await seedDemoHabits(isPro ? 'Pro' : 'Free');
              queryClient.invalidateQueries({ queryKey: HABITS_KEY });
            }}
          />
        }
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onToggle={() => toggle(item.id)}
            onPress={() => router.push(`/habit/${item.id}`)}
            onDelete={() => remove(item.id)}
          />
        )}
      />

      {/* Floating action button */}
      <Animated.View style={[styles.fab, { backgroundColor: colors.primary, borderRadius: radii.full }, fabStyle]}>
        <TouchableOpacity
          onPress={handleFabPress}
          style={styles.fabInner}
          activeOpacity={1}
        >
          <Ionicons name="add" size={30} color={colors.textInverse} />
        </TouchableOpacity>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
