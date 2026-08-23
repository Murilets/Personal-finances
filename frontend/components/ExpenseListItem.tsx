import { Pencil, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getCategoryColor } from '../constants/categoryColors';
import { customColors } from '../constants/theme';
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
  const color = getCategoryColor(expense.categoryId);

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
            <Pencil size={16} color={customColors.textSecondary} />
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Trash2 size={16} color={customColors.expense} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: customColors.surface,
    borderWidth: 1,
    borderColor: customColors.border,
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
  amount: { color: customColors.expense, fontWeight: '500' },
  note: { fontSize: 13, color: customColors.text },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 12, color: customColors.textSecondary },
  actions: { flexDirection: 'row', gap: 14, justifyContent: 'flex-end', marginLeft: 'auto' },
});
