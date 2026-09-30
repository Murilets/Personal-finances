import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { makeStyles, useAppTheme } from '../../context/ThemeContext';
import { useNavItems } from '../../hooks/useNavItems';
import { useActiveRoute } from '../../navigation/ActiveRouteContext';
import { navigate } from '../../navigation/navigationRef';

export default function BottomNav() {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const activeRoute = useActiveRoute();
  const navItems = useNavItems();

  return (
    <View style={styles.bar}>
      {navItems.map(({ route, label, icon: Icon }) => {
        const active = activeRoute === route;
        return (
          <Pressable key={route} onPress={() => navigate(route)} style={styles.item}>
            <Icon size={20} color={active ? colors.primary : colors.textSecondary} />
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}


const useStyles = makeStyles((c) => ({
  bar: {
    flexDirection: 'row',
    backgroundColor: c.surface,
    borderTopWidth: 1,
    borderTopColor: c.border,
    paddingVertical: 8,
  },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontSize: 12, color: c.textSecondary },
  labelActive: { color: c.primary, fontWeight: '600' },
}));
