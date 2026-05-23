export const hasFirebaseEnv =
  Boolean(process.env.FIREBASE_PROJECT_ID) &&
  Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
  Boolean(process.env.FIREBASE_PRIVATE_KEY);

export const hasOpenAIEnv = Boolean(process.env.OPENAI_API_KEY);
export const hasAnthropicEnv = Boolean(process.env.ANTHROPIC_API_KEY);

// Demo mode only requires AI key — Firebase is optional (data won't persist across restarts)
export const isDemoMode = !hasAnthropicEnv;
