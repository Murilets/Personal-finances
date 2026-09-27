import { MonthOption } from '../types/dashboard';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatBRL(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return currencyFormatter.format(0);
  }
  return currencyFormatter.format(value);
}

// Lista fixa em vez de Intl: nomes de mês por locale não são garantidos no Hermes (nativo)
export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function formatMonthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} de ${year}`;
}

export function formatMonthShort(month: number): string {
  return MONTH_NAMES[month - 1].slice(0, 3);
}

export function formatMonthName(month: number): string {
  return MONTH_NAMES[month - 1].toLowerCase();
}

// UTC para bater com o YearMonth do backend (datas gravadas como timestamptz)
export function getCurrentPeriod(): MonthOption {
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}
