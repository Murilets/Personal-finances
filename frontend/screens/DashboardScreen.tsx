import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import CategorySpendingCard from '../components/dashboard/CategorySpendingCard';
import MetricCard from '../components/dashboard/MetricCard';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { getCategoryColor } from '../constants/categoryColors';
import { customColors } from '../constants/theme';
import { useDashboardMonths, useDashboardSummary } from '../hooks/useDashboard';
import { MonthOption } from '../types/dashboard';
import { formatBRL, formatMonthLabel, getCurrentPeriod } from '../utils/formatters';

export default function DashboardScreen() {
  // sem filtro = mês atual do ano atual
  const [period, setPeriod] = useState<MonthOption>(getCurrentPeriod);

  const { summary, isLoading, isError, refetch } = useDashboardSummary(period);
  const { months } = useDashboardMonths();

  // anos com despesas + o ano atual (caso a lista ainda não tenha carregado), do mais recente
  const years = [...new Set([getCurrentPeriod().year, ...months.map((m) => m.year)])].sort(
    (a, b) => b - a,
  );

  const monthLabel = formatMonthLabel(period.year, period.month);
  const topCategory = summary?.topCategory ?? null;

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

      <CategorySpendingCard period={period} years={years} onPeriodChange={setPeriod} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 36, gap: 24 },
  subtitle: { color: customColors.textSecondary, marginTop: 4 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
});
