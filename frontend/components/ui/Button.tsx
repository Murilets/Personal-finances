import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { customColors } from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';

export interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: PaperButtonProps['icon'];
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// variante → modo do Paper
const MODES: Record<ButtonVariant, PaperButtonProps['mode']> = {
  primary: 'contained',
  secondary: 'outlined',
  text: 'text',
  danger: 'text',
};

// Botão padrão do app: altura 40 e cantos de 8px em todas as variantes
export default function Button({
  children,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
}: ButtonProps) {
  const isDanger = variant === 'danger';

  return (
    <PaperButton
      mode={MODES[variant]}
      onPress={onPress}
      icon={icon}
      loading={loading}
      disabled={disabled}
      textColor={isDanger ? customColors.expense : undefined}
      rippleColor={isDanger ? customColors.expenseSoft : undefined}
      style={[styles.button, variant === 'secondary' && styles.secondary, style]}
      contentStyle={styles.content}
    >
      {children}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: 8, justifyContent: 'center' },
  secondary: { borderColor: customColors.border },
  content: { height: 40 },
});
