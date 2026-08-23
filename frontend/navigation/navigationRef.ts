import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList, RouteName } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(route: RouteName) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(route);
  }
}
