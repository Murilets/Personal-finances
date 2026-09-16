import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import CategorySpendingCard from '../components/dashboard/CategorySpendingCard';
import MetricCard from '../components/dashboard/MetricCard';
import MonthFilterDialog from '../components/dashboard/MonthFilterDialog';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { getCategoryColor } from '../constants/categoryColors';
import { customColors } from '../constants/theme';
import { useDashboardMonths, useDashboardSummary } from '../hooks/useDashboard';
import { ChartType, DashboardPeriod } from '../types/dashboard';
import { formatBRL, formatMonthLabel, getCurrentPeriod, isSamePeriod } from '../utils/formatters';

export default function DashboardScreen() {
  const { summary, isLoading, isError, refetch } = useDashboardSummary();
  const { months } = useDashboardMonths();

  const [chartType, setChartType] = useState<ChartType>('bar');
  const [period, setPeriod] = useState<DashboardPeriod>(getCurrentPeriod);
  const [filterVisible, setFilterVisible] = useState(false);

  const currentPeriod = getCurrentPeriod();
  const hasFilter = !isSamePeriod(period, currentPeriod);
  const monthLabel = summary
    ? formatMonthLabel(summary.year, summary.month)
    : formatMonthLabel(currentPeriod.year, currentPeriod.month);

  const topCategory = summary?.topCategory ?? null;

  const handleApplyFilter = (next: DashboardPeriod) => {
    setPeriod(next);
    setFilterVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text variant="headlineSmall">Dashboard</Text>
        <Text style={styles.subtitle}>Resumo dos seus gastos {monthLabel}</Text>
      </View>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message="Não foi possível carregar o resumo." onRetry={refetch} />}
      {!isLoading && !isError && summary && (
        <View style={styles.metrics}>
          <MetricCard
            label="Total do mês"
            numericValue={summary.monthTotal}
            isCurrency
            delay={0}
          />
          <MetricCard
            label="Total geral"
            numericValue={summary.overallTotal}
            isCurrency
            delay={80}
          />
          <MetricCard
            label="Categorias"
            numericValue={summary.categoryCount}
            delay={160}
          />
          <MetricCard
            label="Maior gasto no mês"
            value={topCategory?.categoryName ?? '—'}
            delay={240}
            dotColor={topCategory ? getCategoryColor(topCategory.color ?? topCategory.categoryId).dot : undefined}
            caption={topCategory ? formatBRL(topCategory.amount) : 'Sem gastos no mês'}
          />
        </View>
      )}

      <CategorySpendingCard
        period={period}
        chartType={chartType}
        hasFilter={hasFilter}
        onChartTypeChange={setChartType}
        onOpenFilter={() => setFilterVisible(true)}
        onClearFilter={() => setPeriod(currentPeriod)}
      />

      <MonthFilterDialog
        visible={filterVisible}
        months={months}
        value={period}
        onApply={handleApplyFilter}
        onDismiss={() => setFilterVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 36, gap: 24 },
  subtitle: { color: customColors.textSecondary, marginTop: 4 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
});
