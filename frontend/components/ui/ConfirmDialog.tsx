import { Text } from 'react-native-paper';
import AppDialog from './AppDialog';
import Button from './Button';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

// Confirmação de ação destrutiva (ex.: excluir); o feedback via snackbar fica na tela
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Excluir',
  loading = false,
  onConfirm,
  onDismiss,
}: ConfirmDialogProps) {
  return (
    <AppDialog
      visible={visible}
      onDismiss={onDismiss}
      title={title}
      actions={[
        <Button key="cancel" variant="text" onPress={onDismiss} disabled={loading}>
          Cancelar
        </Button>,
        <Button key="confirm" variant="danger" onPress={onConfirm} loading={loading} disabled={loading}>
          {confirmLabel}
        </Button>,
      ]}
    >
      <Text>{message}</Text>
    </AppDialog>
  );
}
