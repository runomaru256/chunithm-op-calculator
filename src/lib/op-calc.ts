import { ChartEntry, Difficulty, Music, PossessionInfo, Rank, ScoreRecord } from '@/types';

export const RANK_SCORE: Record<Rank, number> = {
  D: 0,
  C: 500000,
  B: 600000,
  BB: 700000,
  BBB: 800000,
  A: 900000,
  AA: 925000,
  AAA: 950000,
  S: 975000,
  'S+': 990000,
  SS: 1000000,
  'SS+': 1005000,
  SSS: 1007500,
  'SSS+': 1009000,
  MAX: 1010000,
};

const RANK_ORDER: Rank[] = [
  'D', 'C', 'B', 'BB', 'BBB',
  'A', 'AA', 'AAA',
  'S', 'S+', 'SS', 'SS+', 'SSS', 'SSS+', 'MAX',
];

function nextRank(rank: Rank): Rank | null {
  const idx = RANK_ORDER.indexOf(rank);
  return idx < RANK_ORDER.length - 1 ? RANK_ORDER[idx + 1] : null;
}

export function calcOP(
  level: number,
  score: number,
  is_fc: boolean,
  is_aj: boolean,
  isAJC = false,
): number {
  const base = (level + 2) * 5;
  const fcBonus = isAJC ? 1.25 : is_aj ? 1.0 : is_fc ? 0.5 : 0;
  const scoreBonus = score >= 1007500 ? Math.min((score - 1007500) * 0.0015, 3.75) : 0;
  return base + fcBonus + scoreBonus;
}

export function calcMaxOP(level: number): number {
  return (level + 3) * 5;
}

export function calcOPPercent(totalOP: number, totalMaxOP: number): number {
  if (totalMaxOP === 0) return 0;
  return (totalOP / totalMaxOP) * 100;
}

export function mergeData(musics: Music[], records: ScoreRecord[]): ChartEntry[] {
  const recordMap = new Map<string, ScoreRecord>(records.map(r => [r.meta.id, r]));
  const entries: ChartEntry[] = [];

  for (const music of musics) {
    const record = recordMap.get(music.meta.id);

    for (const [diff, levelData] of Object.entries(music.data) as [Difficulty, { level: number }][]) {
      if (!levelData || levelData.level <= 0) continue;

      const sd = record?.data[diff];
      const score = sd?.score ?? 0;
      const rank = (sd?.rank ?? 'D') as Rank;
      const is_fc = sd?.is_fc ?? false;
      const is_aj = sd?.is_aj ?? false;

      const nr = nextRank(rank);
      const currentOP = calcOP(levelData.level, score, is_fc, is_aj);
      const maxOP = calcMaxOP(levelData.level);

      entries.push({
        id: music.meta.id,
        title: music.meta.title,
        difficulty: diff,
        level: levelData.level,
        score,
        rank,
        is_fc,
        is_aj,
        currentOP,
        maxOP,
        opGap: maxOP - currentOP,
        effectiveOpGap: 0,  // 後工程で設定
        isActive: false,    // 後工程で設定
        toSSS: Math.max(0, 1007500 - score),
        toSSSPlus: Math.max(0, 1009000 - score),
        toMAX: Math.max(0, 1010000 - score),
        toNextRank: nr ? Math.max(0, RANK_SCORE[nr] - score) : 0,
      });
    }
  }

  // 楽曲ごとに現在の最高OP・最高maxOPを計算し、isActive と effectiveOpGap を設定
  const bestCurrentBySong = new Map<string, number>();
  for (const e of entries) {
    const cur = bestCurrentBySong.get(e.id) ?? -Infinity;
    if (e.currentOP > cur) bestCurrentBySong.set(e.id, e.currentOP);
  }

  return entries.map(e => {
    const songBestOP = bestCurrentBySong.get(e.id) ?? 0;
    return {
      ...e,
      effectiveOpGap: Math.max(0, e.maxOP - songBestOP),
      isActive: e.currentOP >= songBestOP - 0.0001,
    };
  });
}

/**
 * OP合計を計算（各楽曲で最高OP難易度のみを集計）
 */
export function calcTotals(entries: ChartEntry[]) {
  // 楽曲ごとに現在の最高OP難易度を選ぶ
  const bestCurrentBySong = new Map<string, number>();
  const bestMaxBySong = new Map<string, number>();

  for (const e of entries) {
    const bc = bestCurrentBySong.get(e.id) ?? -Infinity;
    if (e.currentOP > bc) bestCurrentBySong.set(e.id, e.currentOP);

    const bm = bestMaxBySong.get(e.id) ?? -Infinity;
    if (e.maxOP > bm) bestMaxBySong.set(e.id, e.maxOP);
  }

  let totalOP = 0;
  for (const v of bestCurrentBySong.values()) totalOP += v;

  let totalMaxOP = 0;
  for (const v of bestMaxBySong.values()) totalMaxOP += v;

  return { totalOP, totalMaxOP, percent: calcOPPercent(totalOP, totalMaxOP) };
}

/**
 * 目標OP%を達成するための最小譜面数パターン
 * effectiveOpGap（楽曲への実効貢献差）を使用
 */
export function calcAchievementPatterns(
  entries: ChartEntry[],
  totalOP: number,
  totalMaxOP: number,
  goalPercent: number,
) {
  const targetOP = (goalPercent / 100) * totalMaxOP;
  const deltaOP = Math.max(0, targetOP - totalOP);

  if (deltaOP === 0) return [];

  // 楽曲ごとの現在最高OP
  const bestCurrentBySong = new Map<string, number>();
  for (const e of entries) {
    const cur = bestCurrentBySong.get(e.id) ?? -Infinity;
    if (e.currentOP > cur) bestCurrentBySong.set(e.id, e.currentOP);
  }

  function effectiveGain(e: ChartEntry, newOP: number): number {
    const songBest = bestCurrentBySong.get(e.id) ?? 0;
    return Math.max(0, newOP - songBest);
  }

  // パターン: 理論値（AJC+SSS+）
  const theoreticalGains = entries
    .map(e => ({ e, gain: effectiveGain(e, calcMaxOP(e.level)) }))
    .filter(x => x.gain > 0.001)
    .sort((a, b) => b.gain - a.gain);

  // パターン: AJ+SSS+
  const ajGains = entries
    .map(e => ({ e, gain: effectiveGain(e, calcOP(e.level, 1010000, true, true)) }))
    .filter(x => x.gain > 0.001)
    .sort((a, b) => b.gain - a.gain);

  // パターン: SSS+のみ（FC/AJはそのまま）
  const sssGains = entries
    .map(e => ({ e, gain: effectiveGain(e, calcOP(e.level, 1010000, e.is_fc, e.is_aj)) }))
    .filter(x => x.gain > 0.001)
    .sort((a, b) => b.gain - a.gain);

  function countNeeded(gains: { gain: number }[]): number {
    let acc = 0;
    for (let i = 0; i < gains.length; i++) {
      acc += gains[i].gain;
      if (acc >= deltaOP) return i + 1;
    }
    return -1;
  }

  function opAfterN(gains: { gain: number }[], n: number): number {
    const gained = gains.slice(0, n).reduce((s, x) => s + x.gain, 0);
    return calcOPPercent(totalOP + gained, totalMaxOP);
  }

  const tCount = countNeeded(theoreticalGains);
  const aCount = countNeeded(ajGains);
  const sCount = countNeeded(sssGains);

  return [
    {
      label: `理論値 ${tCount === -1 ? '?' : tCount} 譜面`,
      desc: 'AJC + SSS+（完璧プレイ）',
      count: tCount,
      percentAfter: tCount > 0 ? opAfterN(theoreticalGains, tCount) : 0,
      achievable: tCount !== -1,
    },
    {
      label: `AJ ${aCount === -1 ? '?' : aCount} 譜面`,
      desc: 'AJ + SSS+',
      count: aCount,
      percentAfter: aCount > 0 ? opAfterN(ajGains, aCount) : 0,
      achievable: aCount !== -1,
    },
    {
      label: `SSS+ ${sCount === -1 ? '?' : sCount} 譜面`,
      desc: 'SSS+（FC/AJはそのまま）',
      count: sCount,
      percentAfter: sCount > 0 ? opAfterN(sssGains, sCount) : 0,
      achievable: sCount !== -1,
    },
  ];
}

/**
 * ポゼッション達成状況（全難易度のランクを確認）
 */
export function calcPossession(entries: ChartEntry[], opPercent: number): PossessionInfo {
  // ポゼッションの判定はすべて MASTER・ULTIMA のみ
  const masterUlta = entries.filter(e => e.difficulty === 'MASTER' || e.difficulty === 'ULTIMA');

  function rankScore(rank: Rank) { return RANK_SCORE[rank] ?? 0; }

  const silverMissing = masterUlta.filter(e => rankScore(e.rank) < RANK_SCORE['S']);
  const goldMissing = masterUlta.filter(e => rankScore(e.rank) < RANK_SCORE['S+']);
  const platinumMissing = masterUlta.filter(e => rankScore(e.rank) < RANK_SCORE['SS']);
  const rainbowMissing = masterUlta.filter(e => rankScore(e.rank) < RANK_SCORE['SS+']);

  const silverOk = silverMissing.length === 0;
  const goldOk = goldMissing.length === 0 && opPercent >= 97.5;
  const platinumOk = platinumMissing.length === 0 && opPercent >= 99.0;
  const rainbowOk = rainbowMissing.length === 0 && opPercent >= 99.5;

  const tier: PossessionInfo['tier'] = rainbowOk ? 'rainbow'
    : platinumOk ? 'platinum'
    : goldOk ? 'gold'
    : silverOk ? 'silver'
    : 'none';

  return { tier, silverOk, goldOk, platinumOk, rainbowOk, silverMissing, goldMissing, platinumMissing, rainbowMissing };
}
