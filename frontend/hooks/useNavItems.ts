import { LayoutDashboard, Receipt, Tag } from 'lucide-react-native';
import { RouteName } from '../navigation/types';

export interface NavItem {
  route: RouteName;
  label: string;
  icon: typeof Receipt;
}

export const NAV_ITEMS: NavItem[] = [
  { route: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'Expenses', label: 'Despesas', icon: Receipt },
  { route: 'Categories', label: 'Categorias', icon: Tag },
];

export function useNavItems() {
  return NAV_ITEMS;
}
