import {
  ActivityIndicator,
  TouchableOpacity,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/services/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ label, variant = 'primary', loading = false, disabled, style, ...rest }: ButtonProps) {
  const { colors, spacing, radii, typography } = useTheme();

  const containerStyle: ViewStyle = (() => {
    const base: ViewStyle = {
      height: 48,
      borderRadius: radii.lg,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ?? loading ? 0.5 : 1,
    };
    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: colors.primary };
      case 'secondary':
        return { ...base, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary };
      case 'ghost':
        return { ...base, backgroundColor: 'transparent' };
    }
  })();

  const textColor = (() => {
    switch (variant) {
      case 'primary': return colors.textInverse;
      case 'secondary': return colors.primary;
      case 'ghost': return colors.primary;
    }
  })();

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      disabled={disabled ?? loading}
      activeOpacity={0.75}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text
          variant="label"
          color={textColor}
          style={{ fontSize: typography.size.md, fontWeight: '600' }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
