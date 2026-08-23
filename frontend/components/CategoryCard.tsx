import { Pencil, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getCategoryColor } from '../constants/categoryColors';
import { customColors } from '../constants/theme';
import { Category } from '../types/category';

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const color = getCategoryColor(category.id);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.dot, { backgroundColor: color.dot }]} />
          <Text style={styles.name}>{category.name}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={onEdit} hitSlop={8}>
            <Pencil size={16} color={customColors.textSecondary} />
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Trash2 size={16} color={customColors.expense} />
          </Pressable>
        </View>
      </View>
      {category.description && <Text style={styles.description}>{category.description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: customColors.surface,
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 12,
    padding: 16,
    minWidth: 220,
    flexGrow: 1,
    flexBasis: 220,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { fontSize: 15, fontWeight: '600', color: customColors.text },
  actions: { flexDirection: 'row', gap: 12 },
  description: { fontSize: 13, color: customColors.textSecondary, marginTop: 4 },
});
