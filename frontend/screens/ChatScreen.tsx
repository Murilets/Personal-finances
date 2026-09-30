import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { makeStyles } from '../context/ThemeContext';

// Placeholder visual mockado — integração real de chat com IA é fase futura do roadmap.
const MOCK_MESSAGES = [
  { from: 'agent', text: 'Oi! Posso te ajudar a consultar ou registrar gastos. O que você precisa?' },
  { from: 'user', text: 'quanto gastei em mercado esse mês?' },
  { from: 'agent', text: 'Você gastou R$ 342,80 em Mercado esse mês, em 4 registros.' },
] as const;

export default function ChatScreen() {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Chat</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Converse sobre seus gastos (mock — sem integração ainda)
      </Text>
      <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
        {MOCK_MESSAGES.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              msg.from === 'user' ? styles.bubbleUser : styles.bubbleAgent,
            ]}
          >
            <Text style={msg.from === 'user' ? styles.bubbleTextUser : styles.bubbleTextAgent}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


const useStyles = makeStyles((c) => ({
  container: { flex: 1, padding: 36 },
  subtitle: { color: c.textSecondary, marginTop: 4, marginBottom: 24 },
  messages: { flex: 1, maxWidth: 640 },
  messagesContent: { gap: 12, paddingBottom: 16 },
  bubble: { maxWidth: '70%', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14 },
  bubbleAgent: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    alignSelf: 'flex-start',
  },
  bubbleUser: {
    backgroundColor: c.primary,
    alignSelf: 'flex-end',
  },
  bubbleTextAgent: { color: c.text },
  bubbleTextUser: { color: c.onPrimary },
}));
