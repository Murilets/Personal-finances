import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import EmptyState from '../EmptyState';
import ErrorState from '../ErrorState';
import LoadingState from '../LoadingState';
import CategoryDonutChart from './CategoryDonutChart';
import CategoryList from './CategoryList';
import MonthlyTrendPanel from './MonthlyTrendPanel';
import MonthYearFilter from './MonthYearFilter';
import { customColors } from '../../constants/theme';
import { useCategoryBreakdown, useMonthlyTrend } from '../../hooks/useDashboard';
import { MonthOption } from '../../types/dashboard';

// abaixo disso as três colunas (donut | lista | tendência) viram uma pilha
const WIDE_BREAKPOINT = 860;

export default function CategorySpendingCard({
  period,
  years,
  onPeriodChange,
}: {
  period: MonthOption;
  years: number[];
  onPeriodChange: (period: MonthOption) => void;
}) {
  const { breakdown, isLoading, isError, refetch } = useCategoryBreakdown(period);
  const { trend } = useMonthlyTrend(period);
  const [bodyWidth, setBodyWidth] = useState(0);

  // mede o card (não a janela): a sidebar já ocupa parte da tela no desktop
  const isWide = bodyWidth >= WIDE_BREAKPOINT;

  const handleLayout = (e: LayoutChangeEvent) => setBodyWidth(e.nativeEvent.layout.width);

  const renderBody = () => {
    if (isLoading) return <LoadingState />;
    if (isError || !breakdown) {
      return (
        <ErrorState message="Não foi possível carregar os gastos por categoria." onRetry={refetch} />
      );
    }
    if (breakdown.total === 0) return <EmptyState message="Nenhum gasto neste período." />;

    return (
      <View style={[styles.body, isWide ? styles.bodyWide : styles.bodyNarrow]}>
        <View style={[styles.donut, isWide && styles.donutWide]}>
          <CategoryDonutChart items={breakdown.items} total={breakdown.total} />
        </View>

        <View style={isWide ? styles.listWide : undefined}>
          <CategoryList items={breakdown.items} />
        </View>

        {/* se só a tendência falhar, o card continua funcionando sem o painel */}
        {trend && trend.length > 0 && (
          <View style={isWide ? styles.trendWide : styles.trendNarrow}>
            <MonthlyTrendPanel trend={trend} />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Gastos por categoria</Text>
        <MonthYearFilter value={period} years={years} onChange={onPeriodChange} />
      </View>

      <View onLayout={handleLayout}>{renderBody()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: customColors.surface,
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  title: { fontSize: 17, fontWeight: '700', color: customColors.text },
  body: { gap: 28 },
  bodyWide: { flexDirection: 'row', alignItems: 'center' },
  bodyNarrow: { flexDirection: 'column', gap: 24 },
  donut: { alignItems: 'center' },
  donutWide: { width: 220 },
  listWide: { flex: 1 },
  trendWide: {
    width: 260,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: customColors.border,
    paddingLeft: 24,
  },
  trendNarrow: {
    borderTopWidth: 1,
    borderTopColor: customColors.border,
    paddingTop: 20,
  },
});
