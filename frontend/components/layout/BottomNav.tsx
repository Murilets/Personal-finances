import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { customColors } from '../../constants/theme';
import { useNavItems } from '../../hooks/useNavItems';
import { useActiveRoute } from '../../navigation/ActiveRouteContext';
import { navigate } from '../../navigation/navigationRef';

export default function BottomNav() {
  const activeRoute = useActiveRoute();
  const navItems = useNavItems();

  return (
    <View style={styles.bar}>
      {navItems.map(({ route, label, icon: Icon }) => {
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
