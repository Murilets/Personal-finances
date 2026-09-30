import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { makeStyles, useAppTheme } from '../context/ThemeContext';

export default function LoadingState() {
  const styles = useStyles();
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}


const useStyles = makeStyles((c) => ({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
}));
