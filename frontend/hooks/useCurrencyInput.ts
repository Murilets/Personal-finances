import { useCallback, useState } from 'react';

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatBRL(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return formatter.format(0);
  }
  return formatter.format(value);
}

export interface UseCurrencyInputOptions {
  initialValue?: number | null;
}

export function useCurrencyInput(initialValue: number | null = 0) {
  const [numericValue, setNumericValueState] = useState<number>(initialValue ?? 0);
  const [formattedValue, setFormattedValue] = useState<string>(() => formatBRL(initialValue ?? 0));

  const setNumericValue = useCallback((val: number | null | undefined) => {
    const safeVal = val != null && !isNaN(val) ? val : 0;
    setNumericValueState(safeVal);
    setFormattedValue(formatBRL(safeVal));
  }, []);

  const handleChangeText = useCallback((text: string) => {
    // Strips all non-digit characters
    const digitsOnly = text.replace(/\D/g, '');

    if (!digitsOnly) {
      setNumericValueState(0);
      setFormattedValue(formatBRL(0));
      return;
    }

    // Converts digits into cents (e.g., "12345" -> 123.45)
    const cents = parseInt(digitsOnly, 10) / 100;
    setNumericValueState(cents);
    setFormattedValue(formatBRL(cents));
  }, []);

  const reset = useCallback(() => {
    setNumericValueState(0);
    setFormattedValue(formatBRL(0));
  }, []);

  return {
    numericValue,
    formattedValue,
    handleChangeText,
    setNumericValue,
    reset,
  };
}
