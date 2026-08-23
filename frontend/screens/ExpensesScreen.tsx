import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseFormDialog, { ExpenseFormValues } from '../components/ExpenseFormDialog';
import ExpenseListItem from '../components/ExpenseListItem';
import ExpenseTable, { SortDir, SortKey } from '../components/ExpenseTable';
import LoadingState from '../components/LoadingState';
import Pagination from '../components/Pagination';
import { customColors } from '../constants/theme';
import { useCategories } from '../hooks/useCategories';
import { useExpenses } from '../hooks/useExpenses';
import { ApiError } from '../services/api';
import { Expense, ExpenseFilters as ExpenseFiltersValue } from '../types/expense';

const WIDE_BREAKPOINT = 768;

export default function ExpensesScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;

  const [filters, setFilters] = useState<ExpenseFiltersValue>({});
  const { categories } = useCategories();
  const { expenses, isLoading, isError, refetch, create, update, remove } = useExpenses(filters);

  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>(-1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formVisible, setFormVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  const mutationError =
    (create.error as ApiError | null)?.message ??
    (update.error as ApiError | null)?.message ??
    null;

  const sorted = useMemo(() => {
    const copy = [...expenses];
    copy.sort((a, b) => {
      let av: string | number = a.date;
      let bv: string | number = b.date;
      if (sortKey === 'category') {
        av = a.category.name;
        bv = b.category.name;
      } else if (sortKey === 'amount') {
        av = a.amount;
        bv = b.amount;
      }
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });
    return copy;
  }, [expenses, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const handleFiltersChange = (next: ExpenseFiltersValue) => {
    setFilters(next);
    setPage(1);
  };

  const openCreate = () => {
    setEditingExpense(null);
    setFormVisible(true);
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    create.reset();
    update.reset();
  };

  const handleSubmit = (values: ExpenseFormValues) => {
    const request = {
      amount: Number(values.amount.replace(',', '.')),
      date: new Date(`${values.date}T00:00:00.000Z`).toISOString(),
      categoryId: values.categoryId,
      note: values.note || null,
    };
    if (editingExpense) {
      update.mutate(
        { id: editingExpense.id, request },
        { onSuccess: () => setFormVisible(false) }
      );
    } else {
      create.mutate(request, { onSuccess: () => setFormVisible(false) });
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    remove.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall">Despesas</Text>
      <Text style={styles.subtitle}>Todos os seus gastos registrados</Text>

      <View style={styles.topRow}>
        <ExpenseFilters categories={categories} filters={filters} onChange={handleFiltersChange} />
        <Button mode="contained" onPress={openCreate}>
          + Nova despesa
        </Button>
      </View>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message="Não foi possível carregar as despesas." onRetry={refetch} />}
      {!isLoading && !isError && sorted.length === 0 && (
        <EmptyState message="Nenhuma despesa encontrada." />
      )}

      {!isLoading && !isError && sorted.length > 0 && (
        <>
          {isWide ? (
            <ExpenseTable
              expenses={pageItems}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ) : (
            <View style={styles.list}>
              {pageItems.map((expense) => (
                <ExpenseListItem
                  key={expense.id}
                  expense={expense}
                  onEdit={() => openEdit(expense)}
                  onDelete={() => setDeleteTarget(expense)}
                />
              ))}
            </View>
          )}

          <Pagination
            page={currentPage}
            pageSize={pageSize}
            total={sorted.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      )}

      <ExpenseFormDialog
        visible={formVisible}
        expense={editingExpense}
        categories={categories}
        onDismiss={closeForm}
        onSubmit={handleSubmit}
        submitting={create.isPending || update.isPending}
        errorMessage={mutationError}
      />

      <Portal>
        <Dialog visible={!!deleteTarget} onDismiss={() => setDeleteTarget(null)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Excluir despesa</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja excluir essa despesa? Essa ação não pode ser desfeita.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTarget(null)} disabled={remove.isPending}>
              Cancelar
            </Button>
            <Button
              onPress={confirmDelete}
              loading={remove.isPending}
              disabled={remove.isPending}
              textColor={customColors.expense}
            >
              Excluir
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 36 },
  subtitle: { color: customColors.textSecondary, marginTop: 4, marginBottom: 24 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
  },
  list: { gap: 10 },
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
});
