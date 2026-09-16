import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { customColors } from '../../constants/theme';
import AnimatedNumber from './AnimatedNumber';

export default function MetricCard({
  label,
  value,
  numericValue,
  isCurrency = false,
  delay = 0,
  dotColor,
  caption,
}: {
  label: string;
  value?: string;
  numericValue?: number;
  isCurrency?: boolean;
  delay?: number;
  dotColor?: string;
  caption?: string;
}) {
  const displayVal = numericValue !== undefined ? numericValue : (value ?? '');

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
        <AnimatedNumber
          value={displayVal}
          isCurrency={isCurrency}
          delay={delay}
          style={styles.value}
        />
      </View>
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: customColors.surface,
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 6,
    flexGrow: 1,
    flexBasis: 180,
    minWidth: 180,
  },
  label: { fontSize: 13, fontWeight: '500', color: customColors.textSecondary },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 8, overflow: 'hidden' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  value: { fontSize: 22, fontWeight: '600', color: customColors.text, flexShrink: 1 },
  caption: { fontSize: 13, color: customColors.textSecondary },
});
