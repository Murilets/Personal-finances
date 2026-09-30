import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { makeStyles } from '../context/ThemeContext';

export default function EmptyState({ message }: { message: string }) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}


const useStyles = makeStyles((c) => ({
  container: { padding: 40, alignItems: 'center' },
  message: { color: c.textSecondary },
}));
