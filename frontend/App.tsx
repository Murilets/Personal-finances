import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppShell from './components/layout/AppShell';
import { buildPaperTheme } from './constants/theme';
import { ThemeProvider, useAppTheme } from './context/ThemeContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { ActiveRouteProvider, useSetActiveRoute } from './navigation/ActiveRouteContext';
import { navigationRef } from './navigation/navigationRef';
import RootNavigator from './navigation/RootNavigator';
import { RouteName } from './navigation/types';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function ThemedApp() {
  const { colors, isDark, ready } = useAppTheme();
  const [fontsLoaded, fontsError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const paperTheme = useMemo(() => buildPaperTheme(colors, isDark), [colors, isDark]);

  const appReady = ready && (fontsLoaded || !!fontsError);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <PaperProvider theme={paperTheme}>
      <SnackbarProvider>
        <ActiveRouteProvider>
          <NavigationTree />
        </ActiveRouteProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SnackbarProvider>
    </PaperProvider>
  );
}

function NavigationTree() {
  const setActiveRoute = useSetActiveRoute();
  const { colors, isDark } = useAppTheme();
  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = useMemo(
    () => ({
      ...base,
      colors: { ...base.colors, background: colors.bg, card: colors.surface, border: colors.border, text: colors.text, primary: colors.primary },
    }),
    [base, colors],
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navTheme}
      onReady={() => setActiveRoute(navigationRef.getCurrentRoute()?.name as RouteName)}
      onStateChange={() => setActiveRoute(navigationRef.getCurrentRoute()?.name as RouteName)}
    >
      <AppShell>
        <RootNavigator />
      </AppShell>
    </NavigationContainer>
  );
}
