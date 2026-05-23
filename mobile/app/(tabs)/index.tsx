import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { scanImage } from '@/services/api';
import type { ScanResult } from '@/types';

export default function ScanScreen() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  async function handleScan(source: 'camera' | 'library') {
    const pickerFn =
      source === 'camera'
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

    const picked = await pickerFn({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    setImageUri(asset.uri);
    setResult(null);
    setScanning(true);

    try {
      const scanResult = await scanImage(asset.base64!);
      setResult(scanResult);
    } catch (err) {
      Alert.alert('Scan failed', 'Could not identify food items. Try again.');
    } finally {
      setScanning(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headline}>Scan your fridge</Text>
      <Text style={styles.sub}>
        Point the camera at your fridge, pantry, or meal and we'll score every item.
      </Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.btn} onPress={() => handleScan('camera')}>
          <Text style={styles.btnText}>Open Camera</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnSecondary]} onPress={() => handleScan('library')}>
          <Text style={[styles.btnText, styles.btnTextSecondary]}>Choose Photo</Text>
        </Pressable>
      </View>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      )}

      {scanning && <ActivityIndicator style={styles.spinner} size="large" color="#2d6a4f" />}

      {result && (
        <View style={styles.results}>
          <Text style={styles.resultsHeading}>
            Found {result.items.length} items — total score {result.totalScore > 0 ? '+' : ''}{result.totalScore}
          </Text>
          {result.items.map((item, i) => (
            <View key={i} style={styles.foodRow}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodExplain}>{item.explanation}</Text>
              </View>
              <Text style={[styles.score, item.score >= 0 ? styles.scorePos : styles.scoreNeg]}>
                {item.score > 0 ? '+' : ''}{item.score}
              </Text>
            </View>
          ))}
          <Pressable
            style={[styles.btn, styles.btnLog]}
            onPress={() => router.push({ pathname: '/(tabs)/log', params: { pendingLog: JSON.stringify(result.items) } })}
          >
            <Text style={styles.btnText}>Log these items</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 48, gap: 16 },
  headline: { fontSize: 26, fontWeight: '700', color: '#111' },
  sub: { fontSize: 15, color: '#555', lineHeight: 22 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { flex: 1, backgroundColor: '#2d6a4f', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  btnSecondary: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#2d6a4f' },
  btnLog: { marginTop: 16, flex: 0 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  btnTextSecondary: { color: '#2d6a4f' },
  preview: { width: '100%', height: 220, borderRadius: 12, marginTop: 8 },
  spinner: { marginTop: 32 },
  results: { marginTop: 8, gap: 2 },
  resultsHeading: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 12 },
  foodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  foodInfo: { flex: 1, gap: 2 },
  foodName: { fontSize: 15, fontWeight: '600', color: '#111' },
  foodExplain: { fontSize: 13, color: '#777', lineHeight: 18 },
  score: { fontSize: 18, fontWeight: '700', minWidth: 36, textAlign: 'right' },
  scorePos: { color: '#2d6a4f' },
  scoreNeg: { color: '#c0392b' },
});
