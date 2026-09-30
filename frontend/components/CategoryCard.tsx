import { Pencil, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getCategoryColor } from '../constants/categoryColors';
import { makeStyles, useAppTheme } from '../context/ThemeContext';
import { Category } from '../types/category';

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  width,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  width?: number;
}) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const color = getCategoryColor(category);

  return (
    <View style={[styles.card, width ? { width } : undefined]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.dot, { backgroundColor: color.dot }]} />
          <Text style={styles.name}>{category.name}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={onEdit} hitSlop={8}>
            <Pencil size={16} color={colors.textSecondary} />
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Trash2 size={16} color={colors.expense} />
          </Pressable>
        </View>
      </View>
      {category.description && (
        <Text style={styles.description} numberOfLines={2}>{category.description}</Text>
      )}
    </View>
  );
}


const useStyles = makeStyles((c) => ({
  card: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
    padding: 16,
    minWidth: 220,
    // altura fixa (cabe título + descrição em até 2 linhas) para todos os cards ficarem iguais
    height: 96,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { fontSize: 15, fontWeight: '600', color: c.text },
  actions: { flexDirection: 'row', gap: 14, justifyContent: 'flex-end', marginLeft: 'auto' },
  description: { fontSize: 13, color: c.textSecondary, marginTop: 4 },
}));
