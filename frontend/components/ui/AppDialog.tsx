import { ReactElement, ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import { makeStyles } from '../../context/ThemeContext';

export interface AppDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  children: ReactNode;
  // botões do rodapé como array com key (não use <>...</>): o Dialog.Actions do Paper
  // clona cada filho direto para injetar props, e um Fragment não aceita props
  actions?: ReactElement[];
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

// Diálogo padrão do app (já inclui o Portal)
export default function AppDialog({
  visible,
  onDismiss,
  title,
  children,
  actions,
  contentStyle,
  style,
}: AppDialogProps) {
  const styles = useStyles();
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={[styles.dialog, style]}>
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content style={contentStyle}>{children}</Dialog.Content>
        {actions && <Dialog.Actions style={styles.actions}>{actions}</Dialog.Actions>}
      </Dialog>
    </Portal>
  );
}


const useStyles = makeStyles((c) => ({
  dialog: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
    maxWidth: 440,
    width: '90%',
    alignSelf: 'center',
  },
  title: { color: c.text },
  actions: { gap: 4 },
}));
