import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type ThemeTokens } from './tokens';
import { useThemeStore } from './themeStore';

const ThemeContext = createContext<ThemeTokens>(lightTheme);

interface ThemeProviderProps {
  children: ReactNode;
  /** Pass a full theme to override the user preference (e.g. pro theme). */
  theme?: ThemeTokens;
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const { preference } = useThemeStore();

  const resolved = theme ?? (() => {
    switch (preference) {
      case 'light':  return lightTheme;
      case 'dark':   return darkTheme;
      case 'system': return colorScheme === 'dark' ? darkTheme : lightTheme;
    }
  })();

  return <ThemeContext.Provider value={resolved}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}
