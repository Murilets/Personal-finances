import { StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { useState } from 'react';
import { customColors } from '../constants/theme';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <View style={styles.row}>
      <Text style={styles.info}>
        Mostrando {start} a {end} de {total} itens
      </Text>
      <View style={styles.controls}>
        <Text style={styles.label}>Por página</Text>
        <Menu
          visible={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          anchor={
            <Button mode="outlined" compact onPress={() => setMenuOpen(true)}>
              {pageSize}
            </Button>
          }
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <Menu.Item
              key={size}
              title={String(size)}
              onPress={() => {
                onPageSizeChange(size);
                setMenuOpen(false);
              }}
            />
          ))}
        </Menu>
        <Button mode="outlined" compact disabled={page <= 1} onPress={() => onPageChange(page - 1)}>
          ‹
        </Button>
        <Button
          mode="outlined"
          compact
          disabled={page >= totalPages}
          onPress={() => onPageChange(page + 1)}
        >
          ›
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    flexWrap: 'wrap',
    gap: 12,
  },
  info: { fontSize: 13, color: customColors.textSecondary },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 13, color: customColors.textSecondary },
});
