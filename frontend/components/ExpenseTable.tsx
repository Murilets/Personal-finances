import { Pencil, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { DataTable, Text } from 'react-native-paper';
import { getCategoryColor } from '../constants/categoryColors';
import { customColors } from '../constants/theme';
import { Expense } from '../types/expense';

export type SortKey = 'date' | 'category' | 'amount';
export type SortDir = 1 | -1;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function formatAmount(value: number) {
  return `-R$ ${value.toFixed(2).replace('.', ',')}`;
}

export default function ExpenseTable({
  expenses,
  sortKey,
  sortDir,
  onSort,
  onEdit,
  onDelete,
}: {
  expenses: Expense[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}) {
  const arrow = (key: SortKey) => (sortKey === key ? (sortDir === 1 ? ' ▲' : ' ▼') : '');

  return (
    <DataTable style={styles.card}>
      <DataTable.Header>
        <DataTable.Title onPress={() => onSort('date')} style={styles.dateCol}>
          Data{arrow('date')}
        </DataTable.Title>
        <DataTable.Title onPress={() => onSort('category')} style={styles.categoryCol}>
          Categoria{arrow('category')}
        </DataTable.Title>
        <DataTable.Title style={styles.noteCol}>Descrição</DataTable.Title>
        <DataTable.Title onPress={() => onSort('amount')} numeric style={styles.amountCol}>
          Valor{arrow('amount')}
        </DataTable.Title>
        <DataTable.Title style={styles.actionsCol}> </DataTable.Title>
      </DataTable.Header>

      {expenses.map((expense) => {
        const color = getCategoryColor(expense.categoryId);
        return (
          <DataTable.Row key={expense.id}>
            <DataTable.Cell style={styles.dateCol}>{formatDate(expense.date)}</DataTable.Cell>
            <DataTable.Cell style={styles.categoryCol}>
              <View style={[styles.badge, { backgroundColor: color.bg }]}>
                <Text style={[styles.badgeText, { color: color.text }]}>
                  {expense.category.name}
                </Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell style={styles.noteCol}>{expense.note ?? ''}</DataTable.Cell>
            <DataTable.Cell numeric style={styles.amountCol}>
              <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={styles.actionsCol}>
              <View style={styles.actions}>
                <Pressable onPress={() => onEdit(expense)} hitSlop={8}>
                  <Pencil size={16} color={customColors.textSecondary} />
                </Pressable>
                <Pressable onPress={() => onDelete(expense)} hitSlop={8}>
                  <Trash2 size={16} color={customColors.expense} />
                </Pressable>
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        );
      })}
    </DataTable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: customColors.surface,
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 12,
  },
  dateCol: { flex: 1.2 },
  categoryCol: { flex: 1.4 },
  noteCol: { flex: 2 },
  amountCol: { flex: 1 },
  actionsCol: { flex: 0.8 },
  badge: { paddingVertical: 3, paddingHorizontal: 11, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, fontWeight: '500' },
  amount: { color: customColors.expense, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
});
