import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Menu, Text } from 'react-native-paper';
import { customColors } from '../../constants/theme';

export interface DropdownOption<T extends string | number> {
  value: T;
  label: string;
}

export interface DropdownProps<T extends string | number> {
  value?: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  dense?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Campo + lista que abre logo abaixo, com a mesma largura e o mesmo visual do campo.
// Usa o Menu do Paper (web, Android e iOS) em vez de <select>, que só existe na web.
export default function Dropdown<T extends string | number>({
  value,
  options,
  onChange,
  placeholder = 'Selecione',
  label,
  error = false,
  dense = false,
  style,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const selected = options.find((o) => o.value === value);

  // a largura do campo define a largura da lista
  const handleLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const select = (next: T) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
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
            style={[
              styles.field,
              { height: dense ? 40 : 48 },
              error && styles.fieldError,
              style,
            ]}
            accessibilityRole="button"
            accessibilityLabel={label}
          >
            <Text
              style={[styles.fieldText, !selected && styles.placeholder]}
              numberOfLines={1}
            >
              {selected?.label ?? placeholder}
            </Text>
            <ChevronDown size={16} color={customColors.textSecondary} />
          </Pressable>
        }
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Menu.Item
              key={String(option.value)}
              title={option.label}
              onPress={() => select(option.value)}
              // sobrescreve minWidth/maxWidth e altura padrão do Paper
              style={[styles.item, { minWidth: width, maxWidth: width }, isSelected && styles.itemSelected]}
              contentStyle={styles.itemContent}
              titleStyle={[styles.itemText, isSelected && styles.itemTextSelected]}
            />
          );
        })}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  label: { fontSize: 12, color: customColors.textSecondary, marginLeft: 4 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customColors.border,
    backgroundColor: customColors.surface,
  },
  fieldError: { borderColor: customColors.expense },
  fieldText: { flexShrink: 1, fontSize: 13, color: customColors.text },
  placeholder: { color: customColors.textSecondary },
  list: {
    marginTop: 4,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customColors.border,
    backgroundColor: customColors.surface,
    shadowColor: customColors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  item: { height: 34, paddingHorizontal: 14 },
  itemSelected: { backgroundColor: customColors.primarySoft },
  itemContent: { minWidth: 0, maxWidth: undefined, marginLeft: 0 },
  itemText: { fontSize: 13, color: customColors.text },
  itemTextSelected: { color: customColors.primary, fontWeight: '600' },
});
