import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  roundness: 12,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0E7490',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E1F5EE',
    onPrimaryContainer: '#0E7490',
    secondary: '#22D3EE',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    onSurface: '#1E293B',
    onSurfaceVariant: '#64748B',
    outline: '#E2E8F0',
    error: '#DC2626',
  },
};

export const customColors = {
  primary: '#0E7490',
  accent: '#22D3EE',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  expense: '#DC2626',
  positive: '#16A34A',
  warning: '#D97706',
};

export const snackbarColor = {
  success: '#1ace5cff',
  error: '#fa1616ff',
}

export const fontConfig = {
  fontFamily: 'Inter_400Regular',
};
