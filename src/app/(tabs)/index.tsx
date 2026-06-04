import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { HabitCard, EmptyState, useHabits, useToggleCompletion, useDeleteHabit, seedDemoHabits, HABITS_KEY } from '@/features/habits';
import { useEntitlement } from '@/features/subscription';
import { useTheme } from '@/services/theme';
import { FREE_HABIT_LIMIT } from '@/config';
import { Screen } from '@/shared/ui/Screen';
import { Text } from '@/shared/ui/Text';

export default function HabitListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const { data: habits, isLoading } = useHabits();
  const { mutate: toggle } = useToggleCompletion();
  const { mutate: remove } = useDeleteHabit();
  const { data: entitlement } = useEntitlement();
  const queryClient = useQueryClient();

  const isPro = entitlement === 'pro';
  const atFreeLimit = !isPro && (habits?.length ?? 0) >= FREE_HABIT_LIMIT;

  function handleAdd() {
    if (atFreeLimit) {
      router.push('/paywall');
    } else {
      router.push('/habit/new');
    }
  }

  // Set header add button from within the screen
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAdd} style={{ marginRight: 4 }}>
          <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, atFreeLimit, colors.primary]);

  if (isLoading) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListHeaderComponent={
          <Text variant="display" style={{ marginBottom: 20 }}>
            My Habits
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            onAdd={handleAdd}
            onSeedData={async () => {
              await seedDemoHabits(isPro ? 'pro' : 'free');
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
    </Screen>
  );
}
