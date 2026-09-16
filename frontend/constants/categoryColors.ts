export const DEFAULT_CATEGORY_COLORS = [
  '#EF4444', // 1. Vermelho
  '#F97316', // 2. Laranja
  '#F59E0B', // 3. Âmbar
  '#84CC16', // 4. Lima
  '#10B981', // 5. Verde Esmeralda
  '#14B8A6', // 6. Verde Água / Teal
  '#06B6D4', // 7. Ciano
  '#3B82F6', // 8. Azul
  '#6366F1', // 9. Índigo
  '#8B5CF6', // 10. Roxo / Violeta
  '#A855F7', // 11. Púrpura
  '#D946EF', // 12. Magenta
  '#EC4899', // 13. Rosa
  '#F43F5E', // 14. Rose
];

const LEGACY_PALETTE: Array<{ bg: string; text: string; dot: string }> = [
  { bg: '#E1F5EE', text: '#085041', dot: '#5DCAA5' },
  { bg: '#FAEEDA', text: '#633806', dot: '#EF9F27' },
  { bg: '#EEEDFE', text: '#26215C', dot: '#AFA9EC' },
  { bg: '#E6F1FB', text: '#0C447C', dot: '#85B7EB' },
  { bg: '#FBEAF0', text: '#72243E', dot: '#ED93B1' },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  if (c.length < 6) return hex;
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getContrastColor(hex: string): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  if (c.length < 6) return hex;
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const darken = (val: number) => Math.max(0, Math.floor(val * 0.55));
  return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
}

export interface CategoryColorResult {
  dot: string;
  bg: string;
  text: string;
}

/**
 * Retorna as cores de exibição para a categoria (dot, fundo suave e texto com contraste).
 * Suporta passar a cor direta em hexadecimal, o objeto categoria ou o ID legado.
 */
export function getCategoryColor(
  categoryOrColorOrId?: { id?: string; color?: string | null } | string | null,
  fallbackId?: string
): CategoryColorResult {
  let color: string | null | undefined = null;
  let id = fallbackId ?? '';

  if (typeof categoryOrColorOrId === 'object' && categoryOrColorOrId !== null) {
    color = categoryOrColorOrId.color;
    id = categoryOrColorOrId.id ?? fallbackId ?? '';
  } else if (typeof categoryOrColorOrId === 'string') {
    if (categoryOrColorOrId.startsWith('#')) {
      color = categoryOrColorOrId;
    } else {
      id = categoryOrColorOrId;
    }
  }

  if (color && color.trim().length > 0) {
    const hex = color.trim().startsWith('#') ? color.trim() : `#${color.trim()}`;
    return {
      dot: hex,
      bg: hexToRgba(hex, 0.15),
      text: getContrastColor(hex),
    };
  }

  const index = hashString(id) % LEGACY_PALETTE.length;
  return LEGACY_PALETTE[index];
}

/**
 * Sugere de forma inteligente a próxima cor não repetida com base nas categorias existentes.
 */
export function suggestNextCategoryColor(
  existingCategories: Array<{ color?: string | null }>
): string {
  const usedColors = new Set(
    existingCategories
      .map((c) => c.color?.trim().toUpperCase())
      .filter((c): c is string => Boolean(c))
  );

  for (const preset of DEFAULT_CATEGORY_COLORS) {
    if (!usedColors.has(preset.toUpperCase())) {
      return preset;
    }
  }

  // Se todas já foram utilizadas, seleciona com base na contagem
  const index = existingCategories.length % DEFAULT_CATEGORY_COLORS.length;
  return DEFAULT_CATEGORY_COLORS[index];
}
