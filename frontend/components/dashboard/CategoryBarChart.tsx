import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getCategoryColor } from '../../constants/categoryColors';
import { customColors } from '../../constants/theme';
import { CategorySpending } from '../../types/dashboard';
import { formatBRL } from '../../utils/formatters';

function CategoryBarRow({
  item,
  maxAmount,
  index,
}: {
  item: CategorySpending;
  maxAmount: number;
  index: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const color = getCategoryColor(item.color ?? item.categoryId);
  const targetPercent = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 650,
      delay: index * 60,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [item.amount, maxAmount, index]);

  const widthInterpolation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${targetPercent}%`],
  });

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color.dot }]} />
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolation,
              backgroundColor: color.dot,
            },
          ]}
        />
      </View>
      <Text style={styles.amount}>{formatBRL(item.amount)}</Text>
    </View>
  );
}

export default function CategoryBarChart({ items }: { items: CategorySpending[] }) {
  // barras são relativas ao maior valor, não ao total
  const maxAmount = Math.max(0, ...items.map((item) => item.amount)) || 1;

  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <CategoryBarRow
          key={item.categoryId}
          item={item}
          maxAmount={maxAmount}
          index={index}
        />
      ))}
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
