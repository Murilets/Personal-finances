import { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getCategoryColor } from '../../constants/categoryColors';
import { customColors } from '../../constants/theme';
import { CategorySpending } from '../../types/dashboard';
import { formatBRL } from '../../utils/formatters';

const CategoryRow = memo(function CategoryRow({
  item,
  index,
  isLast,
}: {
  item: CategorySpending;
  index: number;
  isLast: boolean;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const color = getCategoryColor(item.color ?? item.categoryId);

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 650,
      delay: index * 60,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [item.percentage, index]);

  // a barra representa a fatia do total (53% do total = 53% do trilho), igual ao donut
  const widthInterpolation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${item.percentage}%`],
  });

  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={styles.label}>
        <View style={[styles.dot, { backgroundColor: color.dot }]} />
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width: widthInterpolation, backgroundColor: color.dot }]}
        />
      </View>
      <Text style={styles.amount} numberOfLines={1}>
        {formatBRL(item.amount)}
      </Text>
      <Text style={styles.percent}>{Math.round(item.percentage)}%</Text>
    </View>
  );
});

function CategoryList({ items }: { items: CategorySpending[] }) {
  return (
    <View>
      {items.map((item, index) => (
        <CategoryRow
          key={item.categoryId}
          item={item}
          index={index}
          isLast={index === items.length - 1}
        />
      ))}
    </View>
  );
}

export default memo(CategoryList);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: customColors.border },
  label: { width: 110, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  name: { flex: 1, fontSize: 14, color: customColors.text },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 16,
    backgroundColor: customColors.track,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 2 },
  amount: {
    minWidth: 88,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: customColors.text,
  },
  percent: {
    width: 40,
    textAlign: 'right',
    fontSize: 13,
    color: customColors.textSecondary,
  },
});
