import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { customColors } from '../../constants/theme';
import { DashboardPeriod, MonthOption } from '../../types/dashboard';
import { formatMonthLabel, isSamePeriod } from '../../utils/formatters';

export default function MonthFilterDialog({
  visible,
  months,
  value,
  onApply,
  onDismiss,
}: {
  visible: boolean;
  months: MonthOption[];
  value: DashboardPeriod;
  onApply: (period: DashboardPeriod) => void;
  onDismiss: () => void;
}) {
  // rascunho: só vira filtro aplicado ao clicar em "Aplicar"
  const [draft, setDraft] = useState<DashboardPeriod>(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const options: { key: string; label: string; period: DashboardPeriod }[] = [
    ...months.map((m) => ({
      key: `${m.year}-${m.month}`,
      label: formatMonthLabel(m.year, m.month),
      period: m,
    })),
    { key: 'all', label: 'Todos os meses', period: null },
  ];

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Filtrar por mês</Dialog.Title>
        <Dialog.Content>
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {options.map((option) => {
              const selected = isSamePeriod(option.period, draft);
              return (
                <Pressable
                  key={option.key}
                  onPress={() => setDraft(option.period)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={customColors.textSecondary}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={() => onApply(draft)} style={styles.applyButton}>
            Aplicar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 12,
    maxWidth: 360,
    width: '90%',
    alignSelf: 'center',
  },
  dialogTitle: {
    color: '#000000',
  },
  list: { maxHeight: 320 },
  listContent: { gap: 6 },
  option: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  optionSelected: { backgroundColor: '#E1F5EE' },
  optionText: { fontSize: 14, color: customColors.text },
  optionTextSelected: { color: customColors.primary, fontWeight: '500' },
  applyButton: { borderRadius: 8 },
});
