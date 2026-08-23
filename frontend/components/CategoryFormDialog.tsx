import { useEffect, useState } from 'react';
import { Button, Dialog, HelperText, Portal, TextInput } from 'react-native-paper';
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
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{category ? 'Editar categoria' : 'Nova categoria'}</Dialog.Title>
        <Dialog.Content style={{ gap: 12 }}>
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
