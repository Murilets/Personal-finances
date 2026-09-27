import { MD3LightTheme } from 'react-native-paper';

// Fonte única das cores do app. Componentes usam customColors; o tema do Paper
// (abaixo) referencia os mesmos tokens, então trocar uma cor aqui muda os dois.
export const customColors = {
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
  track: '#EEF0F2', // trilho de barras de progresso
  shadow: '#101828',
  expense: '#DC2626',
  expenseSoft: 'rgba(239, 68, 68, 0.12)', // ripple/realce de ação destrutiva
  positive: '#16A34A',
  warning: '#D97706',
};

export const snackbarColor = {
  success: '#1ace5cff',
  error: '#fa1616ff',
};

export const theme = {
  ...MD3LightTheme,
  roundness: 12,
  colors: {
    ...MD3LightTheme.colors,
    primary: customColors.primary,
    onPrimary: customColors.onPrimary,
    primaryContainer: customColors.primarySoft,
    onPrimaryContainer: customColors.primary,
    secondary: customColors.accent,
    background: customColors.bg,
    surface: customColors.surface,
    onSurface: customColors.text,
    onSurfaceVariant: customColors.textSecondary,
    outline: customColors.border,
    error: customColors.expense,
  },
};

export const fontConfig = {
  fontFamily: 'Inter_400Regular',
};
