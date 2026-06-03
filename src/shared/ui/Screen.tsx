import { type ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/services/theme';

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Wrap content in a ScrollView. */
  scroll?: boolean;
  /** Apply horizontal padding from spacing.md. */
  padded?: boolean;
}

export function Screen({ children, style, scroll = false, padded = true }: ScreenProps) {
  const { colors, spacing } = useTheme();

  const inner: ViewStyle = {
    flex: 1,
    paddingHorizontal: padded ? spacing.md : 0,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[inner, style]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[inner, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
