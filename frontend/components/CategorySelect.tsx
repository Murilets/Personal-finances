import { ChevronDown } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { customColors } from '../constants/theme';
import { Category } from '../types/category';

export default function CategorySelect({
  label,
  value,
  onChange,
  categories,
  placeholder = 'Selecione a categoria',
  error = false,
  showAllOption = false,
  dense = false,
}: {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  categories: Category[];
  placeholder?: string;
  error?: boolean;
  showAllOption?: boolean;
  dense?: boolean;
}) {
  const wrapperHeight = dense ? 40 : 48;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.selectWrapper, { height: wrapperHeight }, error && styles.selectWrapperError]}>
        <select
          value={value ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? undefined : val);
          }}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            paddingLeft: '12px',
            paddingRight: '36px',
            fontSize: '14px',
            color: value ? customColors.text : customColors.textSecondary,
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            zIndex: 1,
          }}
        >
          {showAllOption ? (
            <option value="">Todas as categorias</option>
          ) : (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <View style={styles.chevronWrapper} pointerEvents="none">
          <ChevronDown size={18} color={customColors.textSecondary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: customColors.textSecondary,
    marginLeft: 4,
  },
  selectWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  selectWrapperError: {
    borderColor: customColors.expense,
  },
  chevronWrapper: {
    position: 'absolute',
    right: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
