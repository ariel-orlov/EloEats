import Constants from 'expo-constants';
import { getIdToken } from './auth';
import type { FoodItem, ScanResult, LogEntry, LeaderboardResponse } from '@/types';

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl ?? 'http://localhost:3000';

async function authedFetch(path: string, options: RequestInit = {}) {
  const token = await getIdToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function scanImage(base64: string): Promise<ScanResult> {
  return authedFetch('/api/scan', {
    method: 'POST',
    body: JSON.stringify({ image: base64 }),
  });
}

export async function logFoodItems(items: FoodItem[]): Promise<void> {
  return authedFetch('/api/log', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

export async function getFoodLog(): Promise<LogEntry[]> {
  return authedFetch('/api/log');
}

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  return authedFetch('/api/leaderboard');
}
