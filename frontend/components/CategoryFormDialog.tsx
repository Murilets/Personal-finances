import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, HelperText, Portal, TextInput } from 'react-native-paper';
import { customColors } from '../constants/theme';
import { Category } from '../types/category';

export interface CategoryFormValues {
  name: string;
  description: string;
}

export default function CategoryFormDialog({
  visible,
  category,
  onDismiss,
  onSubmit,
  submitting,
  errorMessage,
}: {
  visible: boolean;
  category: Category | null;
  onDismiss: () => void;
  onSubmit: (values: CategoryFormValues) => void;
  submitting: boolean;
  errorMessage?: string | null;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(category?.name ?? '');
      setDescription(category?.description ?? '');
      setTouched(false);
    }
  }, [visible, category]);

  const nameError = touched && name.trim().length === 0;

  const handleSubmit = () => {
    setTouched(true);
    if (name.trim().length === 0) return;
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>
          {category ? 'Editar categoria' : 'Nova categoria'}
        </Dialog.Title>
        <Dialog.Content style={styles.dialogContent}>
          <TextInput
            label="Nome"
            value={name}
            onChangeText={setName}
            mode="outlined"
            error={nameError}
          />
          {nameError && <HelperText type="error">Nome é obrigatório</HelperText>}
          <TextInput
            label="Descrição (opcional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
          />
          {errorMessage && <HelperText type="error">{errorMessage}</HelperText>}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={submitting}>
            Cancelar
          </Button>
          <Button onPress={handleSubmit} loading={submitting} disabled={submitting}>
            Salvar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 12,
    maxWidth: 440,
    width: '90%',
    alignSelf: 'center',
  },
  dialogTitle: {
    color: '#000000',
  },
  dialogContent: {
    flexDirection: 'column',
    gap: 14,
  },
});
