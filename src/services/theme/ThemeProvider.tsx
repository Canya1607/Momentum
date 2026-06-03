import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type ThemeTokens } from './tokens';

const ThemeContext = createContext<ThemeTokens>(lightTheme);

interface ThemeProviderProps {
  children: ReactNode;
  /** Pass a full theme to override auto light/dark selection. */
  theme?: ThemeTokens;
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const resolved = theme ?? (colorScheme === 'dark' ? darkTheme : lightTheme);
  return <ThemeContext.Provider value={resolved}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}
