import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as themeColors } from '../constants/theme';

type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof themeColors.dark;
  toggleMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem('theme-mode').then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setMode(saved);
      }
    });
  }, []);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const colors = isDark ? themeColors.dark : themeColors.light;

  const toggleMode = (newMode: ThemeMode) => {
    setMode(newMode);
    AsyncStorage.setItem('theme-mode', newMode);
  };

  const value = useMemo(() => ({ mode, isDark, colors, toggleMode }), [mode, isDark, colors]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
