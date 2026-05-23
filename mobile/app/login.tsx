import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithApple, signInWithGoogle } from '@/services/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleApple() {
    setLoading(true);
    try {
      await signInWithApple();
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Sign in failed', 'Could not sign in with Apple. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Sign in failed', 'Could not sign in with Google. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FridgeWise</Text>
      <Text style={styles.tagline}>Eat well. Beat your friends.</Text>

      {loading ? (
        <ActivityIndicator color="#2d6a4f" />
      ) : (
        <View style={styles.buttons}>
          <View style={styles.btn}>
            <Text style={styles.btnText} onPress={handleApple}>Sign in with Apple</Text>
          </View>
          <View style={[styles.btn, styles.btnGoogle]}>
            <Text style={[styles.btnText, styles.btnTextDark]} onPress={handleGoogle}>Sign in with Google</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 32, padding: 32 },
  title: { fontSize: 36, fontWeight: '800', color: '#111' },
  tagline: { fontSize: 16, color: '#777', marginTop: -24 },
  buttons: { width: '100%', gap: 12 },
  btn: { backgroundColor: '#111', borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  btnGoogle: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#ddd' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  btnTextDark: { color: '#111' },
});
