import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, HelperText, Portal, TextInput } from 'react-native-paper';
import CategorySelect from './CategorySelect';
import DateInput from './DateInput';
import { customColors } from '../constants/theme';
import { useCurrencyInput } from '../hooks/useCurrencyInput';
import { useDateInput } from '../hooks/useDateInput';
import { Category } from '../types/category';
import { Expense } from '../types/expense';

export interface ExpenseFormValues {
  amount: string;
  date: string;
  categoryId: string;
  note: string;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExpenseFormDialog({
  visible,
  expense,
  categories,
  onDismiss,
  onSubmit,
  submitting,
  errorMessage,
}: {
  visible: boolean;
  expense: Expense | null;
  categories: Category[];
  onDismiss: () => void;
  onSubmit: (values: ExpenseFormValues) => void;
  submitting: boolean;
  errorMessage?: string | null;
}) {
  const currencyInput = useCurrencyInput(0);
  const dateInput = useDateInput(todayIso());
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      currencyInput.setNumericValue(expense ? expense.amount : 0);
      dateInput.setDateValue(expense ? expense.date.slice(0, 10) : todayIso());
      setCategoryId(expense?.categoryId ?? categories[0]?.id ?? '');
      setNote(expense?.note ?? '');
      setTouched(false);
    }
  }, [visible, expense, categories]);

  const amountError = touched && currencyInput.numericValue <= 0;
  const dateError = touched && !dateInput.isoValue;
  const categoryError = touched && !categoryId;

  const handleSubmit = () => {
    setTouched(true);
    if (currencyInput.numericValue <= 0 || !dateInput.isoValue || !categoryId) return;
    onSubmit({ amount: String(currencyInput.numericValue), date: dateInput.isoValue, categoryId, note: note.trim() });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>
          {expense ? 'Editar despesa' : 'Nova despesa'}
        </Dialog.Title>
        <Dialog.Content style={styles.dialogContent}>
          <TextInput
            label="Valor"
            value={currencyInput.formattedValue}
            onChangeText={currencyInput.handleChangeText}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={15}
            error={amountError}
          />
          {amountError && <HelperText type="error">Informe um valor maior que zero</HelperText>}

          <DateInput
            label="Data"
            value={dateInput.displayValue}
            onChangeText={dateInput.handleChangeText}
            error={dateError}
          />
          {dateError && <HelperText type="error">Informe uma data válida (DD/MM/AAAA)</HelperText>}

          <CategorySelect
            label="Categoria"
            value={categoryId}
            onChange={(val) => setCategoryId(val ?? '')}
            categories={categories}
            error={categoryError}
          />
          {categoryError && <HelperText type="error">Selecione uma categoria</HelperText>}

          <TextInput
            label="Nota (opcional)"
            value={note}
            onChangeText={setNote}
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
    color: customColors.text,
  },
  dialogContent: {
    flexDirection: 'column',
    gap: 14,
  },
});
