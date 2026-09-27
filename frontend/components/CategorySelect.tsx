import { Dropdown } from './ui';
import { Category } from '../types/category';

// '' representa "Todas as categorias" dentro do dropdown; para fora vira undefined
const ALL = '';

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
  const options = [
    ...(showAllOption ? [{ value: ALL, label: 'Todas as categorias' }] : []),
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <Dropdown
      label={label}
      value={value ?? (showAllOption ? ALL : undefined)}
      options={options}
      onChange={(val) => onChange(val === ALL ? undefined : val)}
      placeholder={placeholder}
      error={error}
      dense={dense}
    />
  );
}
