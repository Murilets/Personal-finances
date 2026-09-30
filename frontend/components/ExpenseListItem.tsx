import { Pencil, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getCategoryColor } from '../constants/categoryColors';
import { makeStyles, useAppTheme } from '../context/ThemeContext';
import { Expense } from '../types/expense';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function formatAmount(value: number) {
  return `-R$ ${value.toFixed(2).replace('.', ',')}`;
}

export default function ExpenseListItem({
  expense,
  onEdit,
  onDelete,
}: {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const styles = useStyles();
  const { colors, isDark } = useAppTheme();
  const color = getCategoryColor(expense.category ?? expense.categoryId, undefined, isDark);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: color.bg }]}>
          <Text style={[styles.badgeText, { color: color.text }]}>{expense.category.name}</Text>
        </View>
        <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
      </View>
      {expense.note && <Text style={styles.note}>{expense.note}</Text>}
      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(expense.date)}</Text>
        <View style={styles.actions}>
          <Pressable onPress={onEdit} hitSlop={8}>
            <Pencil size={16} color={colors.textSecondary} />
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Trash2 size={16} color={colors.expense} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}


const useStyles = makeStyles((c) => ({
  card: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  badgeText: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  amount: { color: c.expense, fontWeight: '500' },
  note: { fontSize: 13, color: c.text },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 12, color: c.textSecondary },
  actions: { flexDirection: 'row', gap: 14, justifyContent: 'flex-end', marginLeft: 'auto' },
}));
