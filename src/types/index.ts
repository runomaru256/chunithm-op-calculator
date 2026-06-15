export type Difficulty = 'BASIC' | 'ADVANCED' | 'EXPERT' | 'MASTER' | 'ULTIMA';

// chunirec API が返す難易度キー（省略形）
export type ApiDifficulty = 'BAS' | 'ADV' | 'EXP' | 'MAS' | 'ULT';

export type Rank =
  | 'D' | 'C' | 'B' | 'BB' | 'BBB'
  | 'A' | 'AA' | 'AAA'
  | 'S' | 'S+' | 'SS' | 'SS+' | 'SSS' | 'SSS+' | 'MAX';

// --- chunirec API raw types (実際のAPIレスポンス形式) ---

export interface ApiMusicDiff {
  level: number;                    // ゲーム内表示レベル（整数 or 小数）
  const: number;                    // 実際の譜面定数（小数）
  is_const_unknown: 0 | 1 | boolean; // APIが boolean で返す場合もある
  maxcombo?: number;
}

export interface ApiMusic {
  meta: {
    id: string;               // ハッシュ文字列 (例: "6a88218b1a936bd3")
    title: string;
    genre: string;
    artist: string;
    release: string;
    bpm: number;
  };
  data: Partial<Record<ApiDifficulty, ApiMusicDiff>>;
}

export interface ApiScoreData {
  score: number;
  rank: string;
  is_fc: 0 | 1 | boolean;
  is_aj: 0 | 1 | boolean;
}

export interface ApiScoreRecord {
  meta: { id: string; title: string };
  data: Partial<Record<ApiDifficulty, ApiScoreData>>;
}

export interface Profile {
  user_name: string;
  rating?: number;
  over_power?: number;
  over_power_progress?: number;
  title?: string;
}

// --- 内部型（アダプター変換後） ---

export interface DiffData {
  level: number;    // 譜面定数（constフィールドの値）
  notes?: number;
}

export interface Music {
  meta: { id: string; title: string };
  data: Partial<Record<Difficulty, DiffData>>;
}

export interface ScoreData {
  score: number;
  rank: string;
  is_fc: boolean;
  is_aj: boolean;
}

export interface ScoreRecord {
  meta: { id: string; title: string };
  data: Partial<Record<Difficulty, ScoreData>>;
}

// --- 計算済み型 ---

export interface ChartEntry {
  id: string;
  title: string;
  difficulty: Difficulty;
  level: number;
  score: number;
  rank: Rank;
  is_fc: boolean;
  is_aj: boolean;
  currentOP: number;
  maxOP: number;
  opGap: number;           // maxOP - currentOP（譜面単体の差）
  effectiveOpGap: number;  // max(0, maxOP - songBestOP)（楽曲への実効貢献差）
  isActive: boolean;       // この難易度が楽曲の最高OPとして計上されているか
  toSSS: number;           // points to SSS  (1,007,500)
  toSSSPlus: number;       // points to SSS+ (1,009,000)
  toMAX: number;           // points to MAX  (1,010,000)
  toNextRank: number;      // points to next rank threshold
}

export type PossessionTier = 'none' | 'silver' | 'gold' | 'platinum' | 'rainbow';

export interface PossessionInfo {
  tier: PossessionTier;
  silverOk: boolean;
  goldOk: boolean;
  platinumOk: boolean;
  rainbowOk: boolean;
  silverMissing: ChartEntry[];
  goldMissing: ChartEntry[];
  platinumMissing: ChartEntry[];
  rainbowMissing: ChartEntry[];
}

export interface OPHistoryEntry {
  date: string;
  totalOP: number;
  totalMaxOP: number;
  opPercent: number;
  userName: string;
}

export interface SimulatorEntry {
  chartId: string;
  difficulty: Difficulty;
  newScore: number;
  newFC: boolean;
  newAJ: boolean;
}
