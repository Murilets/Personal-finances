import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, Path, Polygon, Polyline } from 'react-native-svg';
import { customColors } from '../../constants/theme';
import { MonthlyTotal } from '../../types/dashboard';
import { formatMonthName, formatMonthShort } from '../../utils/formatters';

const CHART_HEIGHT = 56;
const PAD = 4; // espaço para o ponto final (raio 4) não ser cortado
const DEFAULT_WIDTH = 228;

// variação % do último mês contra o anterior; null quando o anterior é 0 (divisão impossível)
function getChange(trend: MonthlyTotal[]): number | null {
  if (trend.length < 2) return null;
  const last = trend[trend.length - 1].total;
  const prev = trend[trend.length - 2].total;
  if (prev <= 0) return null;
  return ((last - prev) / prev) * 100;
}

// converte os totais em coordenadas do SVG: x espaçado igualmente, y proporcional ao maior total
function buildPoints(trend: MonthlyTotal[], width: number) {
  const max = Math.max(...trend.map((t) => t.total)) || 1;
  const usableWidth = width - PAD * 2;
  const usableHeight = CHART_HEIGHT - PAD * 2;
  const step = trend.length > 1 ? usableWidth / (trend.length - 1) : 0;

  return trend.map((t, i) => ({
    x: PAD + i * step,
    // SVG cresce para baixo: total máximo fica no topo (y = PAD)
    y: PAD + usableHeight - (t.total / max) * usableHeight,
  }));
}

export default function MonthlyTrendPanel({ trend }: { trend: MonthlyTotal[] }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  if (trend.length === 0) return null;

  const change = getChange(trend);
  const prevMonth = trend.length >= 2 ? formatMonthName(trend[trend.length - 2].month) : null;
  const isUp = change !== null && change > 0;
  // gastar mais é ruim (vermelho), gastar menos é bom (verde)
  const changeColor = change === null || change === 0
    ? customColors.textSecondary
    : isUp
      ? customColors.expense
      : customColors.positive;

  const points = buildPoints(trend, width);
  const line = points.map((p) => `${p.x},${p.y}`).join(' ');
  const first = points[0];
  const last = points[points.length - 1];
  // área = linha + dois cantos inferiores para fechar o polígono
  const area = `${line} ${last.x},${CHART_HEIGHT} ${first.x},${CHART_HEIGHT}`;

  const handleLayout = (e: LayoutChangeEvent) => {
    const measured = Math.round(e.nativeEvent.layout.width);
    if (measured > 0 && measured !== width) setWidth(measured);
  };

  return (
    <View>
      <Text style={styles.title}>Tendência mensal</Text>

      <View style={styles.changeRow}>
        {change === null ? (
          <Text style={styles.muted}>
            {prevMonth ? `Sem gastos em ${prevMonth}` : 'Sem dados anteriores'}
          </Text>
        ) : (
          <>
            {change !== 0 && (
              <Svg
                width={12}
                height={12}
                viewBox="0 0 10 10"
                style={!isUp && styles.arrowDown}
              >
                <Path d="M5 1 L9 8 L1 8 Z" fill={changeColor} />
              </Svg>
            )}
            <Text style={[styles.changeValue, { color: changeColor }]}>
              {Math.abs(change).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
            </Text>
            <Text style={[styles.muted, styles.comparison]}>comparação a {prevMonth}</Text>
          </>
        )}
      </View>

      <View style={styles.chart} onLayout={handleLayout}>
        <Svg width={width} height={CHART_HEIGHT}>
          <Polygon points={area} fill={customColors.primary} opacity={0.1} />
          <Polyline
            points={line}
            fill="none"
            stroke={customColors.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx={last.x}
            cy={last.y}
            r={4}
            fill={customColors.primary}
            stroke={customColors.surface}
            strokeWidth={2}
          />
        </Svg>
      </View>

      <View style={styles.labels}>
        {trend.map((t, i) => (
          <Text
            key={`${t.year}-${t.month}`}
            style={[styles.label, i === trend.length - 1 && styles.labelCurrent]}
          >
            {formatMonthShort(t.month)}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 12, fontWeight: '600', color: customColors.textSecondary },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  arrowDown: { transform: [{ rotate: '180deg' }] },
  changeValue: { fontSize: 20, fontWeight: '700' },
  muted: { fontSize: 13, color: customColors.textSecondary },
  // texto mais longo: quebra de linha dentro do painel em vez de estourar a largura
  comparison: { flexShrink: 1 },
  chart: { marginTop: 14, maxWidth: DEFAULT_WIDTH },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: DEFAULT_WIDTH,
    marginTop: 6,
  },
  label: { fontSize: 10, color: customColors.textSecondary },
  labelCurrent: { fontWeight: '700', color: customColors.text },
});
