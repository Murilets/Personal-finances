import { NavigationContainer } from '@react-navigation/native';
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
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppShell from './components/layout/AppShell';
import { theme } from './constants/theme';
import { SnackbarProvider } from './context/SnackbarContext';
import { ActiveRouteProvider, useSetActiveRoute } from './navigation/ActiveRouteContext';
import { navigationRef } from './navigation/navigationRef';
import RootNavigator from './navigation/RootNavigator';
import { RouteName } from './navigation/types';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <SnackbarProvider>
            <ActiveRouteProvider>
              <NavigationTree />
            </ActiveRouteProvider>
            <StatusBar style="auto" />
          </SnackbarProvider>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function NavigationTree() {
  const setActiveRoute = useSetActiveRoute();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setActiveRoute(navigationRef.getCurrentRoute()?.name as RouteName)}
      onStateChange={() => setActiveRoute(navigationRef.getCurrentRoute()?.name as RouteName)}
    >
      <AppShell>
        <RootNavigator />
      </AppShell>
    </NavigationContainer>
  );
}
