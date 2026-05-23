export const hasFirebaseEnv =
  Boolean(process.env.FIREBASE_PROJECT_ID) &&
  Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
  Boolean(process.env.FIREBASE_PRIVATE_KEY);

export const hasOpenAIEnv = Boolean(process.env.OPENAI_API_KEY);

export const isDemoMode = !hasFirebaseEnv || !hasOpenAIEnv;
