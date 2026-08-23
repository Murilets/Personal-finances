import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Menu, TextInput } from 'react-native-paper';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedCategory = categories.find((c) => c.id === filters.categoryId);

  return (
    <View style={styles.row}>
      <TextInput
        mode="outlined"
        label="De (AAAA-MM-DD)"
        value={filters.startDate ?? ''}
        onChangeText={(text) => onChange({ ...filters, startDate: text || undefined })}
        style={styles.dateInput}
        dense
      />
      <TextInput
        mode="outlined"
        label="Até (AAAA-MM-DD)"
        value={filters.endDate ?? ''}
        onChangeText={(text) => onChange({ ...filters, endDate: text || undefined })}
        style={styles.dateInput}
        dense
      />
      <Menu
        visible={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuOpen(true)}>
            {selectedCategory ? selectedCategory.name : 'Todas as categorias'}
          </Button>
        }
      >
        <Menu.Item
          title="Todas as categorias"
          onPress={() => {
            onChange({ ...filters, categoryId: undefined });
            setMenuOpen(false);
          }}
        />
        {categories.map((category) => (
          <Menu.Item
            key={category.id}
            title={category.name}
            onPress={() => {
              onChange({ ...filters, categoryId: category.id });
              setMenuOpen(false);
            }}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' },
  dateInput: { width: 160 },
});
