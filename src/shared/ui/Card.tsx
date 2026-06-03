import { Platform, View, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '@/services/theme';

interface CardProps extends ViewProps {
  padded?: boolean;
}

export function Card({ padded = true, style, children, ...rest }: CardProps) {
  const { colors, spacing, radii } = useTheme();

  const shadowStyle: ViewStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }) ?? {};

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: padded ? spacing.md : 0,
          ...shadowStyle,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
