import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { customColors } from '../../constants/theme';
import { ChartType } from '../../types/dashboard';

const OPTIONS: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Barras' },
  { value: 'pie', label: 'Pizza' },
];

export default function ChartTypeToggle({
  value,
  onChange,
}: {
  value: ChartType;
  onChange: (value: ChartType) => void;
}) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.option, active && styles.optionActive]}
          >
            <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: customColors.bg,
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 999,
    padding: 3,
    gap: 2,
  },
  option: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 999 },
  optionActive: { backgroundColor: customColors.primary },
  optionText: { fontSize: 13, fontWeight: '500', color: customColors.textSecondary },
  optionTextActive: { color: '#FFFFFF' },
});
