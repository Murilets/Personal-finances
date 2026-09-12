import { useCallback, useState } from 'react';

/**
 * Formats a digits-only or raw string into DD/MM/AAAA (max 10 chars).
 */
export function formatToBR(rawText: string): string {
  const digits = rawText.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Converts YYYY-MM-DD (ISO) to DD/MM/AAAA (BR).
 */
export function isoToBr(isoString?: string | null): string {
  if (!isoString) return '';
  const cleanIso = isoString.slice(0, 10);
  const parts = cleanIso.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    if (year.length === 4 && month.length === 2 && day.length === 2) {
      return `${day}/${month}/${year}`;
    }
  }
  return isoString;
}

/**
 * Converts DD/MM/AAAA (BR) to YYYY-MM-DD (ISO).
 * Returns empty string if invalid date.
 */
export function brToIso(brString?: string | null): string {
  if (!brString || brString.length !== 10) return '';
  const parts = brString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      const d = parseInt(day, 10);
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100) {
        return `${year}-${month}-${day}`;
      }
    }
  }
  return '';
}

export function useDateInput(initialValue?: string | null) {
  const parseInitial = (val?: string | null) => {
    if (!val) return { display: '', iso: '' };
    if (val.includes('-')) {
      const br = isoToBr(val);
      const iso = val.slice(0, 10);
      return { display: br, iso };
    }
    if (val.includes('/')) {
      const br = formatToBR(val);
      const iso = brToIso(br);
      return { display: br, iso };
    }
    return { display: '', iso: '' };
  };

  const initial = parseInitial(initialValue);
  const [displayValue, setDisplayValue] = useState<string>(initial.display);
  const [isoValue, setIsoValue] = useState<string>(initial.iso);

  const handleChangeText = useCallback((text: string) => {
    const formatted = formatToBR(text);
    setDisplayValue(formatted);
    const convertedIso = brToIso(formatted);
    setIsoValue(convertedIso);
  }, []);

  const setDateValue = useCallback((val?: string | null) => {
    const parsed = parseInitial(val);
    setDisplayValue(parsed.display);
    setIsoValue(parsed.iso);
  }, []);

  const reset = useCallback(() => {
    setDisplayValue('');
    setIsoValue('');
  }, []);

  return {
    displayValue,
    isoValue,
    isValid: isoValue.length === 10,
    handleChangeText,
    setDateValue,
    reset,
  };
}
