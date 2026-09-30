import { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { makeStyles } from '../../context/ThemeContext';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

const WIDE_BREAKPOINT = 768;

export default function AppShell({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;

  if (isWide) {
    return (
      <View style={styles.rowContainer}>
        <Sidebar />
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={styles.columnContainer}>
      <View style={styles.content}>{children}</View>
      <BottomNav />
    </View>
  );
}


const useStyles = makeStyles((c) => ({
  rowContainer: { flex: 1, flexDirection: 'row', backgroundColor: c.bg },
  columnContainer: { flex: 1, backgroundColor: c.bg },
  content: { flex: 1 },
}));
