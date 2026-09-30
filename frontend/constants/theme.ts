import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Fonte única das cores do app, uma paleta por modo. Componentes leem a paleta
// ativa via useAppTheme() (context/ThemeContext.tsx); o tema do Paper é montado
// por buildPaperTheme a partir da mesma paleta, então trocar uma cor aqui muda os dois.
export const lightColors = {
  primary: '#0E7490',
  onPrimary: '#FFFFFF', // texto/ícone sobre primary
  primarySoft: '#E1F5EE', // fundo de item selecionado/ativo
  accent: '#22D3EE',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#9CA3AF',
  border: '#E2E8F0',
  track: '#EEF0F2', // trilho de barras de progresso e fundo do avatar
  shadow: '#101828',
  expense: '#DC2626',
  expenseSoft: 'rgba(239, 68, 68, 0.12)', // ripple/realce de ação destrutiva
  positive: '#16A34A',
  warning: '#D97706',
};

export type AppColors = typeof lightColors;

export const darkColors: AppColors = {
  primary: '#22D3EE',
  onPrimary: '#0B1220',
  primarySoft: 'rgba(34, 211, 238, 0.14)',
  accent: '#0E7490',
  bg: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textDisabled: '#64748B',
  border: '#334155',
  track: '#334155',
  shadow: '#000000',
  expense: '#F87171',
  expenseSoft: 'rgba(248, 113, 113, 0.16)',
  positive: '#4ADE80',
  warning: '#FBBF24',
};

export const snackbarColor = {
  success: '#1ace5cff',
  error: '#fa1616ff',
};

export function buildPaperTheme(colors: AppColors, isDark: boolean) {
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  return {
    ...base,
    roundness: 12,
    colors: {
      ...base.colors,
      primary: colors.primary,
      onPrimary: colors.onPrimary,
      primaryContainer: colors.primarySoft,
      onPrimaryContainer: colors.primary,
      secondary: colors.accent,
      background: colors.bg,
      surface: colors.surface,
      onSurface: colors.text,
      onSurfaceVariant: colors.textSecondary,
      outline: colors.border,
      error: colors.expense,
    },
  };
}

export const fontConfig = {
  fontFamily: 'Inter_400Regular',
};
