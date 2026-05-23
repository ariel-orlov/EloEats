import { View, Text, StyleSheet, Pressable } from 'react-native';
import { signOut } from '@/services/auth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Profile — coming soon</Text>
      <Pressable style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 },
  placeholder: { color: '#aaa', fontSize: 16 },
  signOut: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  signOutText: { color: '#c0392b', fontWeight: '500' },
});
