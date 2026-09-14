import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, G } from 'react-native-svg';
import { getCategoryColor } from '../../constants/categoryColors';
import { customColors } from '../../constants/theme';
import { CategorySpending } from '../../types/dashboard';
import { formatBRL } from '../../utils/formatters';

const SIZE = 180;
const STROKE = 24; // furo interno de 132px, como no design
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

interface Arc {
  key: string;
  color: string;
  length: number;
  offset: number;
}

function buildArcs(items: CategorySpending[], total: number): Arc[] {
  const arcs: Arc[] = [];
  let offset = 0;
  for (const item of items) {
    if (item.amount <= 0) continue;
    const length = (item.amount / total) * CIRCUMFERENCE;
    arcs.push({ key: item.categoryId, color: getCategoryColor(item.categoryId).dot, length, offset });
    offset += length;
  }
  return arcs;
}

export default function CategoryDonutChart({
  items,
  total,
}: {
  items: CategorySpending[];
  total: number;
}) {
  const arcs = buildArcs(items, total);

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <Svg width={SIZE} height={SIZE}>
          {/* gira -90° para o primeiro arco começar no topo */}
          <G transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            {arcs.map((arc) => (
              <Circle
                key={arc.key}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE}
                strokeDasharray={`${arc.length} ${CIRCUMFERENCE - arc.length}`}
                strokeDashoffset={-arc.offset}
              />
            ))}
          </G>
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.centerLabel}>Total</Text>
          <Text style={styles.centerValue}>{formatBRL(total)}</Text>
        </View>
      </View>

      <View style={styles.legend}>
        {items.map((item) => (
          <View key={item.categoryId} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: getCategoryColor(item.categoryId).dot }]} />
            <Text style={styles.legendName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.legendAmount}>{formatBRL(item.amount)}</Text>
            <Text style={styles.legendPercent}>{Math.round(item.percentage)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 40 },
  chart: { width: SIZE, height: SIZE },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  centerLabel: { fontSize: 12, fontWeight: '500', color: customColors.textSecondary },
  centerValue: { fontSize: 16, fontWeight: '600', color: customColors.text },
  legend: { flex: 1, minWidth: 200, gap: 12 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendName: { flex: 1, fontSize: 14, color: customColors.text },
  legendAmount: { fontSize: 13, fontWeight: '500', color: customColors.text },
  legendPercent: {
    width: 44,
    textAlign: 'right',
    fontSize: 13,
    color: customColors.textSecondary,
  },
});
