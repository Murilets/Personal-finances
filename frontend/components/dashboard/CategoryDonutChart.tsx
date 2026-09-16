import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, G } from 'react-native-svg';
import { getCategoryColor } from '../../constants/categoryColors';
import { customColors } from '../../constants/theme';
import { CategorySpending } from '../../types/dashboard';
import { formatBRL } from '../../utils/formatters';
import AnimatedNumber from './AnimatedNumber';

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
    arcs.push({
      key: item.categoryId,
      color: getCategoryColor(item.color ?? item.categoryId).dot,
      length,
      offset,
    });
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
  const [progress, setProgress] = useState(0);
  const legendAnim = useRef(new Animated.Value(0)).current;
  const arcs = buildArcs(items, total);

  useEffect(() => {
    setProgress(0);
    legendAnim.setValue(0);

    let startTimestamp: number | null = null;
    let frameId: number;
    const duration = 1000;

    const step = (now: number) => {
      if (startTimestamp === null) startTimestamp = now;
      const elapsed = now - startTimestamp;
      const rawProgress = Math.min(1, elapsed / duration);
      // Easing cubic out
      const easeProgress = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(easeProgress);

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setProgress(1);
      }
    };

    frameId = requestAnimationFrame(step);

    Animated.timing(legendAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [total, items]);

  const currentCircumference = CIRCUMFERENCE * progress;

  const legendOpacity = legendAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const legendTranslateY = legendAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <Svg width={SIZE} height={SIZE}>
          {/* gira -90° para o primeiro arco começar no topo */}
          <G transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            {arcs.map((arc) => {
              // Calcula o comprimento visível do arco com base no progresso geral em 360°
              let visibleLength = 0;
              if (currentCircumference > arc.offset) {
                visibleLength = Math.min(arc.length, currentCircumference - arc.offset);
              }

              return (
                <Circle
                  key={arc.key}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${visibleLength} ${CIRCUMFERENCE - visibleLength}`}
                  strokeDashoffset={-arc.offset}
                />
              );
            })}
          </G>
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.centerLabel}>Total</Text>
          <AnimatedNumber
            value={total}
            isCurrency
            duration={850}
            style={styles.centerValue}
          />
        </View>
      </View>

      <Animated.View
        style={[
          styles.legend,
          {
            opacity: legendOpacity,
            transform: [{ translateY: legendTranslateY }],
          },
        ]}
      >
        {items.map((item) => (
          <View key={item.categoryId} style={styles.legendRow}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: getCategoryColor(item.color ?? item.categoryId).dot,
                },
              ]}
            />
            <Text style={styles.legendName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.legendAmount}>{formatBRL(item.amount)}</Text>
            <Text style={styles.legendPercent}>{Math.round(item.percentage)}%</Text>
          </View>
        ))}
      </Animated.View>
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
    overflow: 'hidden',
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
