import { DimensionValue, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getCategoryColor } from '../../constants/categoryColors';
import { customColors } from '../../constants/theme';
import { CategorySpending } from '../../types/dashboard';
import { formatBRL } from '../../utils/formatters';

export default function CategoryBarChart({ items }: { items: CategorySpending[] }) {
  // barras são relativas ao maior valor, não ao total
  const maxAmount = Math.max(0, ...items.map((item) => item.amount)) || 1;

  return (
    <View style={styles.list}>
      {items.map((item) => {
        const color = getCategoryColor(item.categoryId);
        const fillWidth: DimensionValue = `${(item.amount / maxAmount) * 100}%`;
        return (
          <View key={item.categoryId} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: color.dot }]} />
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: fillWidth, backgroundColor: color.dot }]} />
            </View>
            <Text style={styles.amount}>{formatBRL(item.amount)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { width: 96, fontSize: 14, color: customColors.text },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 999 },
  amount: {
    minWidth: 92,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '500',
    color: customColors.text,
  },
});
