import { type ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '@/services/theme';

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Wrap content in a ScrollView. */
  scroll?: boolean;
  /** Apply horizontal padding from spacing.md. */
  padded?: boolean;
  /**
   * Safe-area edges to inset. Defaults to ['top', 'bottom'].
   * Pass ['bottom'] for screens that already have a Stack header
   * (the header owns the top inset in that case).
   */
  edges?: Edge[];
}

export function Screen({ children, style, scroll = false, padded = true, edges = ['top', 'bottom'] }: ScreenProps) {
  const { colors, spacing } = useTheme();

  const inner: ViewStyle = {
    flexGrow: 1,
    padding: padded ? spacing.lg : 0,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={edges}>
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
