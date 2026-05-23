import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { getLeaderboard } from '@/services/api';
import type { LeaderboardEntry } from '@/types';

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getLeaderboard();
    setEntries(data.entries);
    setCurrentUserId(data.currentUserId);
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={item => item.userId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No scores yet. Start logging food to appear here.</Text>}
        renderItem={({ item, index }) => {
          const isMe = item.userId === currentUserId;
          return (
            <View style={[styles.row, isMe && styles.rowHighlight]}>
              <Text style={[styles.rank, index < 3 && styles.rankTop]}>{index + 1}</Text>
              <View style={styles.info}>
                <Text style={[styles.name, isMe && styles.nameMe]}>
                  {item.displayName}{isMe ? ' (you)' : ''}
                </Text>
                <Text style={styles.streak}>{item.streakDays}d streak</Text>
              </View>
              <Text style={[styles.score, item.avgScore >= 0 ? styles.pos : styles.neg]}>
                {item.avgScore > 0 ? '+' : ''}{item.avgScore.toFixed(1)}
              </Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  rowHighlight: { backgroundColor: '#f6faf8' },
  rank: { fontSize: 16, fontWeight: '700', color: '#bbb', width: 32 },
  rankTop: { color: '#f4a261' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '500', color: '#111' },
  nameMe: { fontWeight: '700' },
  streak: { fontSize: 12, color: '#aaa', marginTop: 2 },
  score: { fontSize: 18, fontWeight: '700' },
  pos: { color: '#2d6a4f' },
  neg: { color: '#c0392b' },
  divider: { height: 1, backgroundColor: '#f2f2f2', marginHorizontal: 20 },
  empty: { textAlign: 'center', marginTop: 48, color: '#999', fontSize: 15, paddingHorizontal: 32, lineHeight: 22 },
});
