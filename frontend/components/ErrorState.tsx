import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from './ui';
import { customColors } from '../constants/theme';

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button variant="secondary" onPress={onRetry} style={styles.button}>
          Tentar novamente
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  message: { color: customColors.expense, textAlign: 'center' },
  button: { marginTop: 4 },
});
