import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { customColors } from '../constants/theme';

export default function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 40, alignItems: 'center' },
  message: { color: customColors.textSecondary },
});
