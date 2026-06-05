import { DEMO_MODE } from '@/config';
import { useTheme } from '@/services/theme';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

interface EmptyStateProps {
  onAdd: () => void;
  onSeedData?: () => void;
}

export function EmptyState({ onAdd, onSeedData }: EmptyStateProps) {
  const { spacing, colors, typography } = useTheme();
  return (
    <View style={[styles.container, { paddingVertical: spacing.xxl }]}>
      <View style={[styles.iconBadge, { backgroundColor: `${colors.primary}15`, borderRadius: 28 }]}>
        <Ionicons name="leaf-outline" size={40} color={colors.primary} />
      </View>
      <Text variant="title" style={styles.title}>No habits yet</Text>
      <Text variant="body" style={styles.subtitle}>
        Add your first habit and start building momentum.
      </Text>
      <Button label="Add a Habit" onPress={onAdd} style={styles.button} />
      {DEMO_MODE && onSeedData && (
        <>
          <Text variant="caption" style={{ color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.lg, fontSize: typography.size.md }}>
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
  iconBadge: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { marginBottom: 8, marginTop: 16 },
  subtitle: { textAlign: 'center', marginBottom: 32, opacity: 0.6 },
  button: { width: 200 },
});
