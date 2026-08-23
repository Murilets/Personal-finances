import { createContext, ReactNode, useContext, useState } from 'react';
import { RouteName } from './types';

const ActiveRouteContext = createContext<RouteName | undefined>(undefined);
const SetActiveRouteContext = createContext<(route: RouteName | undefined) => void>(() => {});

export function ActiveRouteProvider({ children }: { children: ReactNode }) {
  const [activeRoute, setActiveRoute] = useState<RouteName | undefined>(undefined);

  return (
    <ActiveRouteContext.Provider value={activeRoute}>
      <SetActiveRouteContext.Provider value={setActiveRoute}>
        {children}
      </SetActiveRouteContext.Provider>
    </ActiveRouteContext.Provider>
  );
}

export function useActiveRoute() {
  return useContext(ActiveRouteContext);
}

export function useSetActiveRoute() {
  return useContext(SetActiveRouteContext);
}
