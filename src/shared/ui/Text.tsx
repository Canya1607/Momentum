import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '@/services/theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'caption' | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
  /** Override color from tokens. */
  color?: string;
}

export function Text({ variant = 'body', color, style, ...rest }: AppTextProps) {
  const { typography, colors } = useTheme();

  const variantStyle: TextStyle = (() => {
    switch (variant) {
      case 'display':
        return { fontSize: typography.size.xxl, fontWeight: '700', lineHeight: typography.size.xxl * 1.2, color: colors.text };
      case 'title':
        return { fontSize: typography.size.xl, fontWeight: '700', lineHeight: typography.size.xl * 1.25, color: colors.text };
      case 'heading':
        return { fontSize: typography.size.lg, fontWeight: '600', lineHeight: typography.size.lg * 1.3, color: colors.text };
      case 'body':
        return { fontSize: typography.size.md, fontWeight: '400', lineHeight: typography.size.md * 1.5, color: colors.text };
      case 'caption':
        return { fontSize: typography.size.xs, fontWeight: '400', lineHeight: typography.size.xs * 1.4, color: colors.textSecondary };
      case 'label':
        return { fontSize: typography.size.sm, fontWeight: '500', lineHeight: typography.size.sm * 1.4, color: colors.text };
    }
  })();

  return (
    <RNText style={[variantStyle, color != null ? { color } : undefined, style]} {...rest} />
  );
}
