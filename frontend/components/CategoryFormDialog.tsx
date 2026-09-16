import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, HelperText, Portal, Text, TextInput } from 'react-native-paper';
import ColorPicker from './ColorPicker';
import { suggestNextCategoryColor } from '../constants/categoryColors';
import { customColors } from '../constants/theme';
import { Category } from '../types/category';

export interface CategoryFormValues {
  name: string;
  description: string;
  color: string;
}

export default function CategoryFormDialog({
  visible,
  category,
  existingCategories = [],
  onDismiss,
  onSubmit,
  submitting,
  errorMessage,
}: {
  visible: boolean;
  category: Category | null;
  existingCategories?: Category[];
  onDismiss: () => void;
  onSubmit: (values: CategoryFormValues) => void;
  submitting: boolean;
  errorMessage?: string | null;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#10B981');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(category?.name ?? '');
      setDescription(category?.description ?? '');
      setColor(category?.color || suggestNextCategoryColor(existingCategories));
      setTouched(false);
    }
  }, [visible, category, existingCategories]);

  const nameError = touched && name.trim().length === 0;

  const handleSubmit = () => {
    setTouched(true);
    if (name.trim().length === 0) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      color: color.trim(),
    });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>
          {category ? 'Editar categoria' : 'Nova categoria'}
        </Dialog.Title>
        <Dialog.Content style={styles.dialogContent}>
          <TextInput
            label="Nome da categoria"
            value={name}
            onChangeText={setName}
            mode="outlined"
            error={nameError}
          />
          {nameError && <HelperText type="error">Nome é obrigatório</HelperText>}
          <TextInput
            label="Digite a dessa categoria (opcional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
          />

          <View style={styles.colorSection}>
            <View style={styles.colorHeader}>
              <Text style={styles.colorLabel}>Cor da categoria</Text>
              <View style={styles.colorPreviewRow}>
                <View style={[styles.colorPreviewDot, { backgroundColor: color }]} />
                <Text style={styles.colorHexText}>{color.toUpperCase()}</Text>
              </View>
            </View>

            <ColorPicker value={color} onChange={setColor} />
          </View>

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
    maxWidth: 460,
    width: '92%',
    alignSelf: 'center',
  },
  dialogTitle: {
    color: '#000000',
  },
  dialogContent: {
    flexDirection: 'column',
    gap: 12,
  },
  colorSection: {
    marginTop: 6,
    gap: 10,
  },
  colorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: customColors.textSecondary,
  },
  colorPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorPreviewDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorHexText: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: customColors.textSecondary,
  },
});
