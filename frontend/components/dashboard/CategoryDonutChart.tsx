import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, G } from 'react-native-svg';
import { getCategoryColor } from '../../constants/categoryColors';
import { customColors } from '../../constants/theme';
import { CategorySpending } from '../../types/dashboard';
import AnimatedNumber from './AnimatedNumber';

export const DONUT_SIZE = 192;
const STROKE = 32; // raio 80 e anel de 32px, como no protótipo
const RADIUS = (DONUT_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = DONUT_SIZE / 2;

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
  const arcs = buildArcs(items, total);

  useEffect(() => {
    setProgress(0);

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

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [total, items]);

  const currentCircumference = CIRCUMFERENCE * progress;

  return (
    <View style={styles.chart}>
      <Svg width={DONUT_SIZE} height={DONUT_SIZE}>
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
        <AnimatedNumber value={total} isCurrency duration={850} style={styles.centerValue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { width: DONUT_SIZE, height: DONUT_SIZE },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    overflow: 'hidden',
  },
  centerLabel: { fontSize: 12, fontWeight: '500', color: customColors.textSecondary },
  centerValue: { fontSize: 19, fontWeight: '700', color: customColors.text },
});
