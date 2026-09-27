import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import CategorySelect from './CategorySelect';
import DateInput from './DateInput';
import { AppDialog, Button } from './ui';
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
    <AppDialog
      visible={visible}
      onDismiss={onDismiss}
      title={expense ? 'Editar despesa' : 'Nova despesa'}
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
    </AppDialog>
  );
}

const styles = StyleSheet.create({
  dialogContent: {
    flexDirection: 'column',
    gap: 14,
  },
});
