import auth from '@react-native-firebase/auth';

export async function getIdToken(): Promise<string> {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

export async function signInWithApple(): Promise<void> {
  // Apple sign-in requires expo-apple-authentication and firebase credential exchange.
  // Full implementation goes here once native modules are configured.
  throw new Error('Apple sign-in not yet implemented');
}

export async function signInWithGoogle(): Promise<void> {
  // Google sign-in requires @react-native-google-signin/google-signin.
  // Full implementation goes here once native modules are configured.
  throw new Error('Google sign-in not yet implemented');
}

export async function signOut(): Promise<void> {
  await auth().signOut();
}
