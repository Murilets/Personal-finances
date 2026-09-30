import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from './ui';
import { makeStyles } from '../context/ThemeContext';

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const styles = useStyles();
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


const useStyles = makeStyles((c) => ({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  message: { color: c.expense, textAlign: 'center' },
  button: { marginTop: 4 },
}));
