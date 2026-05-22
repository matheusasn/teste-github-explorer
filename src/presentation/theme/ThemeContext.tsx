import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, radius, spacing, typography, type ColorPalette } from './tokens';

export type ThemePreference = 'system' | 'light' | 'dark';
type EffectiveMode = 'light' | 'dark';

interface ThemeContextValue {
  preference: ThemePreference;
  mode: EffectiveMode;
  colors: ColorPalette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const mode: EffectiveMode = useMemo(() => {
    if (preference === 'system') return systemColorScheme === 'dark' ? 'dark' : 'light';
    return preference;
  }, [preference, systemColorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      mode,
      colors: mode === 'dark' ? darkColors : lightColors,
      spacing,
      radius,
      typography,
      setPreference,
    }),
    [preference, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme: precisa de <ThemeProvider> acima');
  return ctx;
}
