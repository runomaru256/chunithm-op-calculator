import {
  ApiDifficulty,
  ApiMusic,
  Difficulty,
  Music,
  Rank,
  ScoreRecord,
} from '@/types';

// API省略形 → 内部フルネーム
const DIFF_MAP: Record<string, Difficulty> = {
  BAS: 'BASIC',
  ADV: 'ADVANCED',
  EXP: 'EXPERT',
  MAS: 'MASTER',
  ULT: 'ULTIMA',
};

// records/showall.json の実際のフラット形式
interface ApiRecordFlat {
  id: string;
  diff: string;          // "BAS" | "ADV" | "EXP" | "MAS" | "ULT"
  level: number;
  title: string;
  const: number;
  score: number;
  rating?: number;
  is_const_unknown: boolean;
  is_clear: boolean;
  is_fullcombo: boolean; // ← is_fc ではなく is_fullcombo
  is_alljustice: boolean;// ← is_aj ではなく is_alljustice
  is_fullchain?: boolean;
  is_played: boolean;
}

function scoreToRank(score: number): Rank {
  if (score >= 1010000) return 'MAX';
  if (score >= 1009000) return 'SSS+';
  if (score >= 1007500) return 'SSS';
  if (score >= 1005000) return 'SS+';
  if (score >= 1000000) return 'SS';
  if (score >=  990000) return 'S+';
  if (score >=  975000) return 'S';
  if (score >=  950000) return 'AAA';
  if (score >=  925000) return 'AA';
  if (score >=  900000) return 'A';
  if (score >=  800000) return 'BBB';
  if (score >=  700000) return 'BB';
  if (score >=  600000) return 'B';
  if (score >=  500000) return 'C';
  return 'D';
}

/**
 * chunirec music/showall.json レスポンスを内部型に変換
 * ネスト形式: {meta: {id, title}, data: {BAS: {level, const, ...}, ...}}
 */
export function adaptMusics(raw: unknown): Music[] {
  const arr = extractArray(raw, 'music');

  return (arr as ApiMusic[]).map((item) => {
    if (!item?.meta) return null;
    const data: Music['data'] = {};
    for (const [apiKey, diffData] of Object.entries(item.data ?? {})) {
      const internalKey = DIFF_MAP[apiKey];
      if (!internalKey || !diffData) continue;
      // falsy (0 or false) なら定数公開 → const を使用、truthy (1 or true) なら level で代用
      const constValue = !diffData.is_const_unknown ? diffData.const : diffData.level;
      if (!constValue || constValue <= 0) continue;
      data[internalKey] = {
        level: constValue,
        notes: diffData.maxcombo,
      };
    }
    return { meta: { id: item.meta.id, title: item.meta.title }, data };
  }).filter(Boolean) as Music[];
}

/**
 * chunirec records/showall.json レスポンスを内部型に変換
 * フラット形式: {id, diff, title, score, is_fullcombo, is_alljustice, is_played, ...}
 * → musicId でグループ化して {meta, data: {DIFFICULTY: {score, rank, is_fc, is_aj}}} に変換
 */
export function adaptRecords(raw: unknown): ScoreRecord[] {
  const arr = extractArray(raw, 'records');

  // フラット配列を musicId → ScoreRecord にグループ化
  const grouped = new Map<string, ScoreRecord>();

  for (const item of arr as ApiRecordFlat[]) {
    if (!item?.id) continue;

    const internalDiff = DIFF_MAP[item.diff];
    if (!internalDiff) continue;

    if (!grouped.has(item.id)) {
      grouped.set(item.id, {
        meta: { id: item.id, title: item.title ?? '' },
        data: {},
      });
    }

    const record = grouped.get(item.id)!;
    const score = item.is_played ? (item.score ?? 0) : 0;
    record.data[internalDiff] = {
      score,
      rank: scoreToRank(score),
      is_fc: item.is_played ? Boolean(item.is_fullcombo) : false,
      is_aj: item.is_played ? Boolean(item.is_alljustice) : false,
    };
  }

  return Array.from(grouped.values());
}

/**
 * 配列、またはラッパーオブジェクト内の配列を安全に取り出す
 */
function extractArray(raw: unknown, debugLabel: string): unknown[] {
  if (Array.isArray(raw)) return raw;

  if (raw && typeof raw === 'object') {
    for (const key of ['records', 'musics', 'data', 'items', 'results', 'list']) {
      const val = (raw as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val;
    }
  }

  console.error(`[${debugLabel}] unknown response format:`, JSON.stringify(raw).slice(0, 300));
  throw new Error(`${debugLabel}: 予期しないAPIレスポンス形式です。`);
}
