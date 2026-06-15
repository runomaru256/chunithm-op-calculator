import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Difficulty, Rank } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtOP(op: number) {
  return op.toFixed(2);
}

export function fmtPercent(p: number) {
  return p.toFixed(4) + '%';
}

export function fmtScore(score: number) {
  return score.toLocaleString('ja-JP');
}

// 定数 → 表示レベル変換（13.0〜13.4 → "13"、13.5〜13.9 → "13+"）
export function constToBucket(level: number): string {
  const x10 = Math.round(level * 10);
  const base = Math.floor(x10 / 10);
  return (x10 % 10) >= 5 ? `${base}+` : `${base}`;
}

// 表示レベルバケット一覧（1〜15+）
export const LEVEL_BUCKETS: string[] = Array.from({ length: 15 }, (_, i) => [
  `${i + 1}`,
  `${i + 1}+`,
]).flat();

export const DIFF_COLOR: Record<Difficulty, string> = {
  BASIC: 'bg-green-500',
  ADVANCED: 'bg-yellow-500',
  EXPERT: 'bg-red-500',
  MASTER: 'bg-purple-600',
  ULTIMA: 'bg-gray-900',
};

export const DIFF_LABEL: Record<Difficulty, string> = {
  BASIC: 'BAS',
  ADVANCED: 'ADV',
  EXPERT: 'EXP',
  MASTER: 'MAS',
  ULTIMA: 'ULT',
};

export const RANK_COLOR: Record<Rank, string> = {
  D: 'text-gray-400',
  C: 'text-gray-400',
  B: 'text-gray-400',
  BB: 'text-gray-500',
  BBB: 'text-gray-500',
  A: 'text-green-600',
  AA: 'text-green-600',
  AAA: 'text-green-700',
  S: 'text-sky-600',
  'S+': 'text-sky-600',
  SS: 'text-yellow-500',
  'SS+': 'text-yellow-500',
  SSS: 'text-orange-500',
  'SSS+': 'text-red-600 font-bold',
  MAX: 'text-fuchsia-600 font-bold',
};
