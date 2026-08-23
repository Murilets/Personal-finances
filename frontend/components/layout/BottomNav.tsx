import { Receipt, Tag } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { customColors } from '../../constants/theme';
import { useActiveRoute } from '../../navigation/ActiveRouteContext';
import { navigate } from '../../navigation/navigationRef';
import { RouteName } from '../../navigation/types';

// Só Despesas e Categorias por enquanto — Dashboard e Chat ainda são placeholders sem função real.
const NAV_ITEMS: Array<{ route: RouteName; label: string; icon: typeof Receipt }> = [
  { route: 'Expenses', label: 'Despesas', icon: Receipt },
  { route: 'Categories', label: 'Categorias', icon: Tag },
];

export default function BottomNav() {
  const activeRoute = useActiveRoute();

  return (
    <View style={styles.bar}>
      {NAV_ITEMS.map(({ route, label, icon: Icon }) => {
        const active = activeRoute === route;
        return (
          <Pressable key={route} onPress={() => navigate(route)} style={styles.item}>
            <Icon size={20} color={active ? customColors.primary : customColors.textSecondary} />
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: customColors.surface,
    borderTopWidth: 1,
    borderTopColor: customColors.border,
    paddingVertical: 8,
  },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontSize: 12, color: customColors.textSecondary },
  labelActive: { color: customColors.primary, fontWeight: '600' },
});
