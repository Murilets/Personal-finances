import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import CategorySelect from './CategorySelect';
import { Category } from '../types/category';
import { ExpenseFilters as ExpenseFiltersValue } from '../types/expense';

export default function ExpenseFilters({
  categories,
  filters,
  onChange,
}: {
  categories: Category[];
  filters: ExpenseFiltersValue;
  onChange: (filters: ExpenseFiltersValue) => void;
}) {
  return (
    <View style={styles.row}>
      <TextInput
        mode="outlined"
        label="De"
        placeholder="AAAA-MM-DD"
        value={filters.startDate ?? ''}
        onChangeText={(text) => onChange({ ...filters, startDate: text || undefined })}
        style={styles.dateInput}
        dense
      />
      <TextInput
        mode="outlined"
        label="Até"
        placeholder="AAAA-MM-DD"
        value={filters.endDate ?? ''}
        onChangeText={(text) => onChange({ ...filters, endDate: text || undefined })}
        style={styles.dateInput}
        dense
      />
      <View style={styles.selectContainer}>
        <CategorySelect
          value={filters.categoryId}
          onChange={(categoryId) => onChange({ ...filters, categoryId })}
          categories={categories}
          showAllOption
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap' },
  dateInput: { width: 160 },
  selectContainer: { width: 180, marginBottom: 2 },
});
