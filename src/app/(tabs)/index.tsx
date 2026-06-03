import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { HabitCard, EmptyState, useHabits, useToggleCompletion } from '@/features/habits';
import { useTheme } from '@/services/theme';
import { Screen } from '@/shared/ui/Screen';
import { Text } from '@/shared/ui/Text';

// Free tier: ≤3 habits. Task 8 will gate behind entitlement check.
const FREE_HABIT_LIMIT = 3;

export default function HabitListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const { data: habits, isLoading } = useHabits();
  const { mutate: toggle } = useToggleCompletion();

  const atFreeLimit = (habits?.length ?? 0) >= FREE_HABIT_LIMIT;

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
        ListEmptyComponent={<EmptyState onAdd={handleAdd} />}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onToggle={() => toggle(item.id)}
            onPress={() => router.push(`/habit/${item.id}`)}
          />
        )}
      />
    </Screen>
  );
}
