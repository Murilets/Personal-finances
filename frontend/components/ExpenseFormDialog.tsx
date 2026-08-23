import { useEffect, useState } from 'react';
import { Button, Dialog, HelperText, Menu, Portal, TextInput } from 'react-native-paper';
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
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      setAmount(expense ? String(expense.amount) : '');
      setDate(expense ? expense.date.slice(0, 10) : todayIso());
      setCategoryId(expense?.categoryId ?? categories[0]?.id ?? '');
      setNote(expense?.note ?? '');
      setTouched(false);
    }
  }, [visible, expense, categories]);

  const amountValue = Number(amount.replace(',', '.'));
  const amountError = touched && (!amount || Number.isNaN(amountValue) || amountValue <= 0);
  const categoryError = touched && !categoryId;
  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSubmit = () => {
    setTouched(true);
    if (!amount || Number.isNaN(amountValue) || amountValue <= 0 || !categoryId) return;
    onSubmit({ amount, date, categoryId, note: note.trim() });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{expense ? 'Editar despesa' : 'Nova despesa'}</Dialog.Title>
        <Dialog.Content style={{ gap: 12 }}>
          <TextInput
            label="Valor"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="decimal-pad"
            error={amountError}
          />
          {amountError && <HelperText type="error">Informe um valor maior que zero</HelperText>}

          <TextInput
            label="Data (AAAA-MM-DD)"
            value={date}
            onChangeText={setDate}
            mode="outlined"
          />

          <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            anchor={
              <Button mode="outlined" onPress={() => setMenuOpen(true)}>
                {selectedCategory ? selectedCategory.name : 'Selecione a categoria'}
              </Button>
            }
          >
            {categories.map((category) => (
              <Menu.Item
                key={category.id}
                title={category.name}
                onPress={() => {
                  setCategoryId(category.id);
                  setMenuOpen(false);
                }}
              />
            ))}
          </Menu>
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
