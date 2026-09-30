import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, Text, TextInput } from 'react-native-paper';
import ColorPicker from './ColorPicker';
import { AppDialog, Button } from './ui';
import { DEFAULT_CATEGORY_COLORS, suggestNextCategoryColor } from '../constants/categoryColors';
import { makeStyles } from '../context/ThemeContext';
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
  const styles = useStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(DEFAULT_CATEGORY_COLORS[4]);
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
    <AppDialog
      visible={visible}
      onDismiss={onDismiss}
      title={category ? 'Editar categoria' : 'Nova categoria'}
      style={styles.dialog}
      contentStyle={styles.dialogContent}
      actions={[
        <Button key="cancel" variant="text" onPress={onDismiss} disabled={submitting}>
          Cancelar
        </Button>,
        <Button key="save" variant="text" onPress={handleSubmit} loading={submitting} disabled={submitting}>
          Salvar
        </Button>,
      ]}
    >
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
    </AppDialog>
  );
}


const useStyles = makeStyles((c) => ({
  // um pouco mais largo que o padrão para caber o ColorPicker
  dialog: { maxWidth: 460, width: '92%' },
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
    color: c.textSecondary,
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
    borderColor: c.border,
  },
  colorHexText: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: c.textSecondary,
  },
}));
