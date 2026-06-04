import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { confirmAlert, infoAlert } from '@/shared/lib/alert';
import { useHabit, useCreateHabit, useUpdateHabit, useDeleteHabit } from '@/features/habits';
import { useTheme } from '@/services/theme';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';

const EMOJI_PRESETS = ['💪', '🏃', '📚', '🧘', '💧', '🌿', '✍️', '🎯', '⭐', '😴'];

export default function HabitEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const navigation = useNavigation();
  const router = useRouter();
  const { colors, spacing, radii } = useTheme();

  const { data: habit } = useHabit(isNew ? null : id);
  const { mutateAsync: createAsync, isPending: isCreating } = useCreateHabit();
  const { mutateAsync: updateAsync, isPending: isUpdating } = useUpdateHabit();
  const { mutateAsync: removeAsync, isPending: isDeleting } = useDeleteHabit();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💪');

  // Populate form when editing an existing habit
  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setEmoji(habit.emoji);
    }
  }, [habit]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? 'New Habit' : 'Edit Habit' });
  }, [navigation, isNew]);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      infoAlert('Name required', 'Please enter a habit name.');
      return;
    }
    try {
      if (isNew) {
        await createAsync({ name: trimmed, emoji });
      } else {
        await updateAsync({ id, input: { name: trimmed, emoji } });
      }
      router.back();
    } catch {
      infoAlert('Error', 'Could not save habit. Please try again.');
    }
  }

  function handleDelete() {
    confirmAlert({
      title: 'Delete Habit',
      message: `Delete "${habit?.name ?? 'this habit'}"?`,
      confirmLabel: 'Delete',
      onConfirm: () => {
        removeAsync(id)
          .then(() => router.back())
          .catch(() => infoAlert('Error', 'Could not delete habit.'));
      },
    });
  }

  const isBusy = isCreating || isUpdating || isDeleting;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Emoji picker */}
      <Text variant="label" style={styles.label}>Emoji</Text>
      <Card style={styles.emojiCard}>
        <View style={styles.emojiRow}>
          {EMOJI_PRESETS.map(e => (
            <TouchableOpacity
              key={e}
              onPress={() => setEmoji(e)}
              style={[
                styles.emojiOption,
                {
                  borderRadius: radii.md,
                  backgroundColor: emoji === e ? colors.primary + '22' : 'transparent',
                  borderColor: emoji === e ? colors.primary : 'transparent',
                  borderWidth: 2,
                },
              ]}
            >
              <Text style={{ fontSize: 26 }}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Name input */}
      <Text variant="label" style={[styles.label, { marginTop: spacing.md }]}>Habit name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Morning run"
        placeholderTextColor={colors.textSecondary}
        returnKeyType="done"
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.md,
            color: colors.text,
            padding: spacing.sm + 4,
          },
        ]}
      />

      {/* Save */}
      <Button
        label={isNew ? 'Add Habit' : 'Save Changes'}
        onPress={handleSave}
        loading={isBusy}
        style={{ marginTop: spacing.lg }}
      />

      {/* Delete (edit mode only) */}
      {!isNew && (
        <Button
          label="Delete Habit"
          variant="ghost"
          onPress={handleDelete}
          loading={isDeleting}
          style={{ marginTop: spacing.sm }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 8 },
  emojiCard: { paddingVertical: 12 },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiOption: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  input: { fontSize: 16, borderWidth: 1.5 },
});
