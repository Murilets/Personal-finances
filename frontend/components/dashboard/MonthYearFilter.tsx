import { StyleSheet, View } from 'react-native';
import { Dropdown } from '../ui';
import { MonthOption } from '../../types/dashboard';
import { MONTH_NAMES } from '../../utils/formatters';

const MONTH_OPTIONS = MONTH_NAMES.map((label, index) => ({ value: index + 1, label }));

export default function MonthYearFilter({
  value,
  years,
  onChange,
}: {
  value: MonthOption;
  years: number[];
  onChange: (period: MonthOption) => void;
}) {
  const yearOptions = years.map((year) => ({ value: year, label: String(year) }));

  // trocar o mês mantém o ano e vice-versa
  return (
    <View style={styles.container}>
      <Dropdown
        value={value.month}
        options={MONTH_OPTIONS}
        onChange={(month) => onChange({ year: value.year, month })}
        dense
        style={styles.monthField}
      />
      <Dropdown
        value={value.year}
        options={yearOptions}
        onChange={(year) => onChange({ year, month: value.month })}
        dense
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  // largura fixa para o campo (e a lista) não mudar de tamanho a cada mês escolhido
  monthField: { minWidth: 130 },
});
