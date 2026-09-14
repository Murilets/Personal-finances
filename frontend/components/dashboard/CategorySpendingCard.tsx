import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import EmptyState from '../EmptyState';
import ErrorState from '../ErrorState';
import LoadingState from '../LoadingState';
import CategoryBarChart from './CategoryBarChart';
import CategoryDonutChart from './CategoryDonutChart';
import ChartTypeToggle from './ChartTypeToggle';
import { customColors } from '../../constants/theme';
import { useCategoryBreakdown } from '../../hooks/useDashboard';
import { ChartType, DashboardPeriod } from '../../types/dashboard';
import { formatMonthLabel } from '../../utils/formatters';

export default function CategorySpendingCard({
  period,
  chartType,
  hasFilter,
  onChartTypeChange,
  onOpenFilter,
  onClearFilter,
}: {
  period: DashboardPeriod;
  chartType: ChartType;
  hasFilter: boolean;
  onChartTypeChange: (type: ChartType) => void;
  onOpenFilter: () => void;
  onClearFilter: () => void;
}) {
  const { breakdown, isLoading, isError, refetch } = useCategoryBreakdown(period);

  const filterLabel = period ? formatMonthLabel(period.year, period.month) : 'Todos os meses';

  const renderBody = () => {
    if (isLoading) return <LoadingState />;
    if (isError || !breakdown) {
      return (
        <ErrorState message="Não foi possível carregar os gastos por categoria." onRetry={refetch} />
      );
    }
    if (breakdown.total === 0) return <EmptyState message="Nenhum gasto neste período." />;
    return chartType === 'bar' ? (
      <CategoryBarChart items={breakdown.items} />
    ) : (
      <CategoryDonutChart items={breakdown.items} total={breakdown.total} />
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gastos por categoria</Text>
          <Text style={styles.subtitle}>{filterLabel}</Text>
        </View>
        <View style={styles.actions}>
          {hasFilter && (
            <Pressable onPress={onClearFilter} hitSlop={8} accessibilityRole="button">
              <Text style={styles.clearText}>Limpar filtro</Text>
            </Pressable>
          )}
          <Pressable onPress={onOpenFilter} style={styles.filterButton} accessibilityRole="button">
            <Text style={styles.filterButtonText}>Filtros</Text>
          </Pressable>
          <ChartTypeToggle value={chartType} onChange={onChartTypeChange} />
        </View>
      </View>

      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: customColors.surface,
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  header: { marginBottom: 20, gap: 14 },
  title: { fontSize: 16, fontWeight: '600', color: customColors.text },
  subtitle: { fontSize: 13, color: customColors.textSecondary, marginTop: 2 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
  },
  clearText: { fontSize: 13, fontWeight: '500', color: customColors.primary },
  filterButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customColors.border,
    backgroundColor: customColors.surface,
  },
  filterButtonText: { fontSize: 13, fontWeight: '500', color: customColors.text },
});
