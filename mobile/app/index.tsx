import { useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// In the simulator/dev, the Next.js app runs on your Mac's localhost.
// On a real device over the same Wi-Fi, replace with your Mac's local IP, e.g. http://192.168.1.x:3000
// In production, replace with your deployed URL.
const DEV_URL = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
const PROD_URL = process.env.EXPO_PUBLIC_APP_URL ?? DEV_URL;

export default function AppScreen() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Green status bar area */}
      <View style={[styles.statusBar, { height: 0 }]} />

      {loading && !error && (
        <View style={styles.splash}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>FW</Text>
          </View>
          <Text style={styles.appName}>FridgeWise</Text>
          <Text style={styles.tagline}>Eat well. Beat your friends.</Text>
          <ActivityIndicator color="#d8f3dc" style={styles.spinner} size="large" />
        </View>
      )}

      {error && (
        <View style={styles.splash}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>FW</Text>
          </View>
          <Text style={styles.appName}>FridgeWise</Text>
          <Text style={styles.errorText}>
            Could not connect to the app server.{'\n'}
            Make sure the Next.js dev server is running:{'\n\n'}
            <Text style={styles.code}>cd fridge && npm run dev</Text>
          </Text>
          <Text
            style={styles.retry}
            onPress={() => {
              setError(false);
              setLoading(true);
              webViewRef.current?.reload();
            }}
          >
            Tap to retry
          </Text>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: PROD_URL }}
        style={[styles.webview, (loading || error) && styles.hidden]}
        onLoadEnd={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
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

const GREEN = '#2d6a4f';
const GREEN_LIGHT = '#d8f3dc';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREEN,
  },
  statusBar: {
    backgroundColor: GREEN,
  },
  webview: {
    flex: 1,
    backgroundColor: '#f4faf6',
  },
  hidden: {
    opacity: 0,
    position: 'absolute',
    width: 0,
    height: 0,
  },
  splash: {
    flex: 1,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
  },
  appName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    color: GREEN_LIGHT,
    fontSize: 16,
    marginBottom: 24,
  },
  spinner: {
    marginTop: 16,
  },
  errorText: {
    color: GREEN_LIGHT,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 8,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    color: '#fff',
    fontSize: 13,
  },
  retry: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
});
