import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { customColors } from '../../constants/theme';
import { useNavItems } from '../../hooks/useNavItems';
import { useActiveRoute } from '../../navigation/ActiveRouteContext';
import { navigate } from '../../navigation/navigationRef';

export default function Sidebar() {
  const activeRoute = useActiveRoute();
  const navItems = useNavItems();

  return (
    <View style={styles.sidebar}>
      <View style={styles.logo}>
        <View style={styles.logoMark}>
          <Text style={styles.logoMarkText}>$</Text>
        </View>
        <Text style={styles.logoText}>FinChat</Text>
      </View>

      <View style={styles.nav}>
        {navItems.map(({ route, label, icon: Icon }) => {
          const active = activeRoute === route;
          return (
            <Pressable
              key={route}
              onPress={() => navigate(route)}
              style={[styles.navItem, active && styles.navItemActive]}
            >
              <Icon size={18} color={active ? customColors.primary : customColors.textSecondary} />
              <Text style={[styles.navItemText, active && styles.navItemTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: customColors.surface,
    borderRightWidth: 1,
    borderRightColor: customColors.border,
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: customColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  logoText: { fontWeight: '600', fontSize: 16, color: customColors.primary },
  nav: { gap: 2 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemActive: { backgroundColor: '#E1F5EE' },
  navItemText: { fontSize: 14, fontWeight: '500', color: customColors.textSecondary },
  navItemTextActive: { color: customColors.primary },
});
