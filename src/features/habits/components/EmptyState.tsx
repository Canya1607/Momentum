import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/services/theme';
import { DEMO_MODE } from '@/config';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/shared/ui/Button';

interface EmptyStateProps {
  onAdd: () => void;
  onSeedData?: () => void;
}

export function EmptyState({ onAdd, onSeedData }: EmptyStateProps) {
  const { spacing, colors } = useTheme();
  return (
    <View style={[styles.container, { paddingVertical: spacing.xxl }]}>
      <Text style={styles.icon}>🌱</Text>
      <Text variant="title" style={styles.title}>No habits yet</Text>
      <Text variant="body" style={styles.subtitle}>
        Add your first habit and start building momentum.
      </Text>
      <Button label="Add a Habit" onPress={onAdd} style={styles.button} />
      {DEMO_MODE && onSeedData && (
        <>
          <Text variant="caption" style={{ color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm }}>
            or
          </Text>
          <Button
            label="Load demo data"
            variant="secondary"
            onPress={onSeedData}
            style={styles.button}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { marginBottom: 8 },
  subtitle: { textAlign: 'center', marginBottom: 32, opacity: 0.6 },
  button: { width: 200 },
});
