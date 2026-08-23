import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { customColors } from '../constants/theme';

export default function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={customColors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
});
