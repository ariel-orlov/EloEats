import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { logFoodItems, getFoodLog } from '@/services/api';
import type { FoodItem, LogEntry } from '@/types';

export default function LogScreen() {
  const params = useLocalSearchParams<{ pendingLog?: string }>();
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLog();
  }, []);

  useEffect(() => {
    if (!params.pendingLog) return;
    const items: FoodItem[] = JSON.parse(params.pendingLog);
    logFoodItems(items)
      .then(() => loadLog())
      .catch(() => Alert.alert('Could not save log items'));
  }, [params.pendingLog]);

  async function loadLog() {
    try {
      const entries = await getFoodLog();
      setLog(entries);
    } finally {
      setLoading(false);
    }
  }

  const todayEntries = log.filter(e => {
    const today = new Date().toDateString();
    return new Date(e.loggedAt).toDateString() === today;
  });

  const todayScore = todayEntries.reduce((sum, e) => sum + e.score, 0);

  return (
    <View style={styles.container}>
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Today's score</Text>
        <Text style={[styles.scoreValue, todayScore >= 0 ? styles.pos : styles.neg]}>
          {todayScore > 0 ? '+' : ''}{todayScore}
        </Text>
      </View>

      {loading ? (
        <Text style={styles.empty}>Loading...</Text>
      ) : log.length === 0 ? (
        <Text style={styles.empty}>No food logged yet. Scan your fridge to get started.</Text>
      ) : (
        <FlatList
          data={log}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>
                  {new Date(item.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={[styles.rowScore, item.score >= 0 ? styles.pos : styles.neg]}>
                {item.score > 0 ? '+' : ''}{item.score}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scoreCard: { margin: 20, padding: 20, backgroundColor: '#f6faf8', borderRadius: 14, alignItems: 'center' },
  scoreLabel: { fontSize: 13, color: '#777', textTransform: 'uppercase', letterSpacing: 0.8 },
  scoreValue: { fontSize: 48, fontWeight: '800', marginTop: 4 },
  pos: { color: '#2d6a4f' },
  neg: { color: '#c0392b' },
  empty: { textAlign: 'center', marginTop: 48, color: '#999', fontSize: 15, paddingHorizontal: 32, lineHeight: 22 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  rowInfo: { flex: 1 },
  name: { fontSize: 15, fontWeight: '500', color: '#111' },
  time: { fontSize: 12, color: '#aaa', marginTop: 2 },
  rowScore: { fontSize: 17, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f2f2f2', marginHorizontal: 20 },
});
