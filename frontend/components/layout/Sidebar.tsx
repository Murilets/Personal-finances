import { DollarSign } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { makeStyles, useAppTheme } from '../../context/ThemeContext';
import { useNavItems } from '../../hooks/useNavItems';
import { useActiveRoute } from '../../navigation/ActiveRouteContext';
import { navigate } from '../../navigation/navigationRef';
import SidebarFooter from './SidebarFooter';

export default function Sidebar() {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const activeRoute = useActiveRoute();
  const navItems = useNavItems();

  return (
    <View style={styles.sidebar}>
      <View style={styles.logo}>
        <View style={styles.logoMark}>
          <DollarSign size={18} color={colors.onPrimary} strokeWidth={2.5} />
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
              <Icon size={18} color={active ? colors.primary : colors.textSecondary} />
              <Text style={[styles.navItemText, active && styles.navItemTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <SidebarFooter />
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  sidebar: {
    width: 240,
    backgroundColor: c.surface,
    borderRightWidth: 1,
    borderRightColor: c.border,
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
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontWeight: '600', fontSize: 16, color: c.primary },
  nav: { gap: 2 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemActive: { backgroundColor: c.primarySoft },
  navItemText: { fontSize: 14, fontWeight: '500', color: c.textSecondary },
  navItemTextActive: { color: c.primary },
}));
