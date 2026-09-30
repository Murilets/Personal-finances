import { Moon, Sun, User } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { makeStyles, useAppTheme } from '../../context/ThemeContext';

// Nome exibido no rodapé; será substituído pelo nome da conta quando houver autenticação.
const USER_NAME = '-';

export default function SidebarFooter() {
  const styles = useStyles();
  const { colors, isDark, toggleTheme } = useAppTheme();
  const ThemeIcon = isDark ? Sun : Moon;
  const buttonRef = useRef<View>(null);

  // Na web, o botão é um elemento DOM: o centro dele é a origem da animação circular.
  // No nativo, measure não existe no DOM e a origem fica indefinida (troca sem animação).
  const handleToggle = () => {
    const node = buttonRef.current as unknown as HTMLElement | null;
    if (node?.getBoundingClientRect) {
      const rect = node.getBoundingClientRect();
      toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    } else {
      toggleTheme();
    }
  };

  return (
    <View style={styles.footer}>
      <View style={styles.user}>
        <View style={styles.avatar}>
          <User size={20} color={colors.textSecondary} fill={colors.textSecondary} />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {USER_NAME}
        </Text>
      </View>

      <Pressable
        ref={buttonRef}
        onPress={handleToggle}
        accessibilityRole="button"
        accessibilityLabel="Alternar tema"
        hitSlop={8}
        style={({ hovered, pressed }: { hovered?: boolean; pressed: boolean }) => [
          styles.themeButton,
          (hovered || pressed) && styles.themeButtonActive,
        ]}
      >
        <ThemeIcon size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 'auto',
    paddingTop: 16,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
  user: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: c.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { flexShrink: 1, fontSize: 14, fontWeight: '600', color: c.text },
  themeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonActive: { backgroundColor: c.track },
}));
