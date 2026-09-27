import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Menu, Text } from 'react-native-paper';
import { customColors } from '../../constants/theme';
import { MonthOption } from '../../types/dashboard';
import { MONTH_NAMES } from '../../utils/formatters';

interface Option {
  value: number;
  label: string;
}

// campo + lista que abre logo abaixo, com a mesma largura e o mesmo visual do campo
function Dropdown({
  value,
  options,
  onChange,
  fieldStyle,
}: {
  value: number;
  options: Option[];
  onChange: (value: number) => void;
  fieldStyle?: ViewStyle;
}) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  // a largura do campo define a largura da lista
  const handleLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const select = (next: number) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <Menu
      visible={open}
      onDismiss={() => setOpen(false)}
      anchorPosition="bottom"
      mode="flat"
      contentStyle={[styles.list, { width }]}
      anchor={
        <Pressable
          onPress={() => setOpen(true)}
          onLayout={handleLayout}
          style={[styles.field, fieldStyle]}
          accessibilityRole="button"
        >
          <Text style={styles.fieldText}>{selectedLabel}</Text>
          <ChevronDown size={16} color={customColors.textSecondary} />
        </Pressable>
      }
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Menu.Item
            key={option.value}
            title={option.label}
            onPress={() => select(option.value)}
            // sobrescreve minWidth/maxWidth e alturas padrão do Paper
            style={[styles.item, { minWidth: width, maxWidth: width }, selected && styles.itemSelected]}
            contentStyle={styles.itemContent}
            titleStyle={[styles.itemText, selected && styles.itemTextSelected]}
          />
        );
      })}
    </Menu>
  );
}

export default function MonthYearFilter({
  value,
  years,
  onChange,
}: {
  value: MonthOption;
  years: number[];
  onChange: (period: MonthOption) => void;
}) {
  const monthOptions = MONTH_NAMES.map((label, index) => ({ value: index + 1, label }));
  const yearOptions = years.map((year) => ({ value: year, label: String(year) }));

  // trocar o mês mantém o ano e vice-versa
  return (
    <View style={styles.container}>
      <Dropdown
        value={value.month}
        options={monthOptions}
        onChange={(month) => onChange({ year: value.year, month })}
        fieldStyle={styles.monthField}
      />
      <Dropdown
        value={value.year}
        options={yearOptions}
        onChange={(year) => onChange({ year, month: value.month })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customColors.border,
    backgroundColor: customColors.surface,
  },
  // largura fixa para o campo (e a lista) não mudar de tamanho a cada mês escolhido
  monthField: { minWidth: 130 },
  fieldText: { fontSize: 13, color: customColors.text },
  list: {
    marginTop: 4,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customColors.border,
    backgroundColor: customColors.surface,
    shadowColor: '#101828',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  item: { height: 34, paddingHorizontal: 14 },
  itemSelected: { backgroundColor: '#E1F5EE' },
  itemContent: { minWidth: 0, maxWidth: undefined, marginLeft: 0 },
  itemText: { fontSize: 13, color: customColors.text },
  itemTextSelected: { color: customColors.primary, fontWeight: '600' },
});
