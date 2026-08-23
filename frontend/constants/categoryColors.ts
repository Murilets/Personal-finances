const PALETTE: Array<{ bg: string; text: string; dot: string }> = [
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

export function getCategoryColor(categoryId: string) {
  const index = hashString(categoryId) % PALETTE.length;
  return PALETTE[index];
}
