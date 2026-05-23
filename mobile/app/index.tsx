import { useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// In the simulator/dev, the Next.js app runs on your Mac's localhost.
// On a real device over the same Wi-Fi, replace with your Mac's local IP, e.g. http://192.168.1.x:3000
// In production, replace with your deployed URL.
const DEV_URL = Platform.OS === 'ios' ? 'https://femur-stammer-graduate.ngrok-free.dev' : 'http://10.0.2.2:3000';
const PROD_URL = process.env.EXPO_PUBLIC_APP_URL ?? DEV_URL;

export default function AppScreen() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const showError = error;
  const showSplash = !error && (!fontsLoaded || loading);
  const showWebView = fontsLoaded && !loading && !error;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.orbPrimary} />
        <View style={styles.orbSecondary} />
        <View style={styles.orbTertiary} />
      </View>

      {showSplash && (
        <View style={styles.centerWrap}>
          <View style={styles.card}>
            <View style={styles.logoMark}>
              <Text style={styles.logoText}>FW</Text>
            </View>
            <Text style={styles.appName}>FridgeWise</Text>
            <Text style={styles.tagline}>Eat well. Beat your friends.</Text>
            <View style={styles.loadingRow}>
              <ActivityIndicator color={THEME.primary} />
              <Text style={styles.loadingText}>Connecting to your fridge...</Text>
            </View>
          </View>
          <Text style={styles.footerNote}>Verdant UI - Demo mode ready</Text>
        </View>
      )}

      {showError && (
        <View style={styles.centerWrap}>
          <View style={styles.card}>
            <View style={[styles.logoMark, styles.logoMarkError]}>
              <Text style={styles.logoText}>FW</Text>
            </View>
            <Text style={styles.appName}>FridgeWise</Text>
            <Text style={styles.errorTitle}>We could not reach the app.</Text>
            <Text style={styles.errorText}>
              Start the Next.js server and try again:
            </Text>
            <View style={styles.codeBlock}>
              <Text style={styles.code}>cd fridge && npm run dev</Text>
            </View>
            <Pressable
              onPress={() => {
                setError(false);
                setLoading(true);
                webViewRef.current?.reload();
              }}
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.retryButtonPressed,
              ]}
            >
              <Text style={styles.retryButtonText}>Retry connection</Text>
            </Pressable>
          </View>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: PROD_URL }}
        style={[styles.webview, !showWebView && styles.hidden]}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        onHttpError={({ nativeEvent }) => {
          if (nativeEvent.statusCode >= 500) {
            setLoading(false);
            setError(true);
          }
        }}
        // Allow camera access for the fridge scan feature
        mediaCapturePermissionGrantType="grant"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        // Smooth scrolling + momentum
        decelerationRate="normal"
        // Hide the native browser UI
        originWhitelist={['*']}
        // Inject a small script to suppress the address bar on scroll
        injectedJavaScript={`
          document.documentElement.style.setProperty('--safe-top', '0px');
          true;
        `}
      />
    </View>
  );
}

const THEME = {
  bg: '#f4faf6',
  surface: '#ffffff',
  primary: '#2d6a4f',
  primaryMid: '#52b788',
  primaryLight: '#d8f3dc',
  negative: '#e63946',
  text: '#1b2d22',
  muted: '#6b7c72',
  border: '#e4ede8',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orbPrimary: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 200,
    backgroundColor: THEME.primaryLight,
    top: -180,
    right: -140,
  },
  orbSecondary: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 160,
    backgroundColor: 'rgba(82, 183, 136, 0.22)',
    bottom: -120,
    left: -80,
  },
  orbTertiary: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 120,
    backgroundColor: 'rgba(45, 106, 79, 0.12)',
    top: 140,
    left: 40,
  },
  webview: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  hidden: {
    opacity: 0,
    position: 'absolute',
    width: 0,
    height: 0,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: THEME.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#0c1a13',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoMarkError: {
    backgroundColor: THEME.primaryMid,
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },
  appName: {
    color: THEME.text,
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  tagline: {
    color: THEME.muted,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  loadingText: {
    color: THEME.primary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  footerNote: {
    color: THEME.muted,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  errorTitle: {
    color: THEME.text,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
  },
  errorText: {
    color: THEME.muted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
  },
  codeBlock: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: THEME.bg,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    color: THEME.text,
    fontSize: 13,
  },
  retryButton: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 12,
    backgroundColor: THEME.primary,
  },
  retryButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
