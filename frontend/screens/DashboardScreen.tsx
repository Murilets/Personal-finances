import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { customColors } from '../constants/theme';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Dashboard</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Em breve — aguardando endpoint de agregação no backend.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 36 },
  subtitle: { color: customColors.textSecondary, marginTop: 4 },
});
