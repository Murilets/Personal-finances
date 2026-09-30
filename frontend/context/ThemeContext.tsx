import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { AppColors, darkColors, lightColors } from '../constants/theme';
import { runThemeTransition, TransitionOrigin } from '../utils/themeTransition';

type Mode = 'light' | 'dark';

interface ThemeContextValue {
  colors: AppColors;
  isDark: boolean;
  toggleTheme: (origin?: TransitionOrigin) => void; // origin: centro da animação (ex.: botão)
  ready: boolean; // false até a preferência salva ser lida (evita piscar o tema errado)
}

const STORAGE_KEY = 'finchat:theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [stored, setStored] = useState<Mode | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === 'light' || value === 'dark') setStored(value);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const mode: Mode = stored ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = useCallback((origin?: TransitionOrigin) => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    runThemeTransition(origin, () => setStored(next));
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: mode === 'dark' ? darkColors : lightColors,
      isDark: mode === 'dark',
      toggleTheme,
      ready,
    }),
    [mode, toggleTheme, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme deve ser usado dentro de ThemeProvider');
  return ctx;
}

// Cria um hook de estilos que recalcula quando a paleta muda:
//   const useStyles = makeStyles((c) => ({ box: { backgroundColor: c.surface } }));
//   ... const styles = useStyles();
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: (colors: AppColors) => T) {
  return function useStyles() {
    const { colors } = useAppTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}
