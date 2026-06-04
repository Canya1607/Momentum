import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { useTheme } from '@/services/theme';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  const { colors, spacing } = useTheme();
  return (
    <Card style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.md }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: `${colors.primary}18`,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.xs,
        }}
      >
        <Ionicons name={icon as 'star'} size={20} color={colors.primary} />
      </View>
      <Text variant="heading" style={{ color: colors.text }}>
        {value}
      </Text>
      <Text variant="caption" style={{ color: colors.textSecondary, textAlign: 'center' }}>
        {label}
      </Text>
    </Card>
  );
}
