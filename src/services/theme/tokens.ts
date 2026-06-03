export interface ThemeTokens {
  colors: {
    primary: string;
    primaryPressed: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    textInverse: string;
    border: string;
    success: string;
    danger: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    size: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
  };
}

export const lightTheme: ThemeTokens = {
  colors: {
    primary: '#6366f1',
    primaryPressed: '#4f46e5',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    textInverse: '#ffffff',
    border: '#e2e8f0',
    success: '#22c55e',
    danger: '#ef4444',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  typography: {
    size: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 32 },
  },
};

export const darkTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    primary: '#818cf8',
    primaryPressed: '#6366f1',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textInverse: '#ffffff',
    border: '#334155',
    success: '#4ade80',
    danger: '#f87171',
  },
};

// Demonstrates per-product theming — violet primary instead of indigo.
export const proTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#8b5cf6',
    primaryPressed: '#7c3aed',
  },
};
