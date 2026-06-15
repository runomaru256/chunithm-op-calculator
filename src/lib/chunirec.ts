import { Music, Profile, ScoreRecord } from '@/types';
import { adaptMusics, adaptRecords } from './adapters';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const data = await res.json();

  if (!res.ok) {
    // プロキシからのエラー: { error: "string" }
    // または chunirec API の生エラー: { error: { code, message } }
    const msg = typeof data.error === 'string'
      ? data.error
      : data.error?.message ?? `APIエラー: ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export async function fetchRecords(userName: string): Promise<ScoreRecord[]> {
  const raw = await apiFetch<unknown>(
    `/api/chunirec/records?user_name=${encodeURIComponent(userName)}`,
  );
  return adaptRecords(raw);
}

export async function fetchMusic(): Promise<Music[]> {
  const raw = await apiFetch<unknown>('/api/chunirec/music');
  return adaptMusics(raw);
}

export async function fetchProfile(userName: string): Promise<Profile> {
  return apiFetch<Profile>(
    `/api/chunirec/profile?user_name=${encodeURIComponent(userName)}`,
  );
}
