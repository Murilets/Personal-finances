import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import CategorySelect from './CategorySelect';
import DateInput from './DateInput';
import { customColors } from '../constants/theme';
import { SearchIcon, XIcon } from '../constants/icons';
import { useDateInput } from '../hooks/useDateInput';
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
  const startDateInput = useDateInput(filters.startDate);
  const endDateInput = useDateInput(filters.endDate);
  const [draftCategoryId, setDraftCategoryId] = useState<string | undefined>(filters.categoryId);

  useEffect(() => {
    startDateInput.setDateValue(filters.startDate);
  }, [filters.startDate]);

  useEffect(() => {
    endDateInput.setDateValue(filters.endDate);
  }, [filters.endDate]);

  useEffect(() => {
    setDraftCategoryId(filters.categoryId);
  }, [filters.categoryId]);

  const hasActiveFilters = Boolean(
    startDateInput.displayValue ||
    endDateInput.displayValue ||
    draftCategoryId ||
    filters.startDate ||
    filters.endDate ||
    filters.categoryId
  );

  const handleSearch = () => {
    onChange({
      startDate: startDateInput.isoValue || undefined,
      endDate: endDateInput.isoValue || undefined,
      categoryId: draftCategoryId || undefined,
    });
  };

  const handleClear = () => {
    startDateInput.reset();
    endDateInput.reset();
    setDraftCategoryId(undefined);
    onChange({});
  };

  const clearColor = hasActiveFilters ? customColors.expense : '#9CA3AF';

  return (
    <View style={styles.cardContainer}>
      <DateInput
        label="De"
        value={startDateInput.displayValue}
        onChangeText={startDateInput.handleChangeText}
        style={styles.dateInput}
        dense
      />
      <DateInput
        label="Até"
        value={endDateInput.displayValue}
        onChangeText={endDateInput.handleChangeText}
        style={styles.dateInput}
        dense
      />
      <View style={styles.selectContainer}>
        <CategorySelect
          value={draftCategoryId}
          onChange={setDraftCategoryId}
          categories={categories}
          showAllOption
          dense
        />
      </View>
      <Button
        mode="contained"
        onPress={handleSearch}
        icon={() => <SearchIcon size={16} color="#FFFFFF" />}
        style={styles.searchButton}
        contentStyle={styles.buttonContent}
      >
        Buscar
      </Button>
      <Button
        mode="text"
        onPress={handleClear}
        disabled={!hasActiveFilters}
        textColor={clearColor}
        rippleColor="rgba(239, 68, 68, 0.12)"
        icon={() => <XIcon size={16} color={clearColor} />}
        style={[styles.clearButton, !hasActiveFilters && styles.disabledClearButton]}
        contentStyle={styles.buttonContent}
      >
        Limpar filtros
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customColors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
  },
  dateInput: {
    width: 135,
  },
  selectContainer: {
    width: 170,
    marginTop: 6,
  },
  searchButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 6,
    justifyContent: 'center',
  },
  clearButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 6,
    justifyContent: 'center',
    borderWidth: 0,
  },
  disabledClearButton: {
    opacity: 0.5,
  },
  buttonContent: {
    height: 40,
  },
});
