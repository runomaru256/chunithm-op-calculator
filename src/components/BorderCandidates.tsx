'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/store';
import { RANK_SCORE } from '@/lib/op-calc';
import { DIFF_COLOR, DIFF_LABEL, RANK_COLOR, cn, fmtScore } from '@/lib/utils';
import { Rank } from '@/types';

const KEY_BORDERS: { rank: Rank; label: string }[] = [
  { rank: 'S',   label: 'S (銀ポゼ下限)' },
  { rank: 'S+',  label: 'S+ (金ポゼ下限)' },
  { rank: 'SS',  label: 'SS (鉑ポゼ下限)' },
  { rank: 'SS+', label: 'SS+ (虹ポゼ下限)' },
  { rank: 'SSS', label: 'SSS (スコア補正開始)' },
  { rank: 'SSS+', label: 'SSS+ (理論値)' },
];

export default function BorderCandidates() {
  const charts = useStore(s => s.charts);
  const filterDifficulties = useStore(s => s.filterDifficulties);
  const [targetRank, setTargetRank] = useState<Rank>('SSS');
  const [showCount, setShowCount] = useState(15);

  const candidates = useMemo(() => {
    const targetScore = RANK_SCORE[targetRank];
    return charts
      .filter(
        e =>
          filterDifficulties.includes(e.difficulty) &&
          e.score < targetScore &&
          e.score > 0,
      )
      .map(e => ({ ...e, needed: targetScore - e.score }))
      .sort((a, b) => a.needed - b.needed);
  }, [charts, filterDifficulties, targetRank]);

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9651;</span> ボーダー越え候補
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {KEY_BORDERS.map(({ rank, label }) => (
          <button
            key={rank}
            onClick={() => setTargetRank(rank)}
            className={cn(
              'text-xs px-3 py-1 rounded-full border transition-colors',
              targetRank === rank
                ? 'bg-sky-500 text-white border-sky-500'
                : 'border-sky-200 text-sky-600 hover:bg-sky-50',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-sky-400 mb-3">{candidates.length} 件（少ない点数順）</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sky-50 text-sky-700 text-xs">
              <th className="text-left px-2 py-2 rounded-l-lg">曲名</th>
              <th className="px-2 py-2">難度</th>
              <th className="px-2 py-2">定数</th>
              <th className="px-2 py-2">現スコア</th>
              <th className="px-2 py-2">現ランク</th>
              <th className="px-2 py-2 rounded-r-lg">不足点数</th>
            </tr>
          </thead>
          <tbody>
            {candidates.slice(0, showCount).map((e, i) => (
              <tr
                key={`${e.id}-${e.difficulty}`}
                className={cn(
                  'border-b border-sky-50 hover:bg-sky-50/50',
                  i % 2 === 0 ? '' : 'bg-sky-50/20',
                )}
              >
                <td className="px-2 py-2 max-w-[140px] truncate font-medium text-sky-900">{e.title}</td>
                <td className="px-2 py-2 text-center">
                  <span className={cn('text-xs font-bold text-white px-1.5 py-0.5 rounded', DIFF_COLOR[e.difficulty])}>
                    {DIFF_LABEL[e.difficulty]}
                  </span>
                </td>
                <td className="px-2 py-2 text-center tabular-nums">{e.level.toFixed(1)}</td>
                <td className="px-2 py-2 text-center tabular-nums text-xs">{fmtScore(e.score)}</td>
                <td className={cn('px-2 py-2 text-center font-bold text-xs', RANK_COLOR[e.rank])}>{e.rank}</td>
                <td className="px-2 py-2 text-center">
                  <span
                    className={cn(
                      'font-bold tabular-nums',
                      e.needed <= 1000 ? 'text-red-600' : e.needed <= 5000 ? 'text-orange-500' : 'text-sky-600',
                    )}
                  >
                    -{fmtScore(e.needed)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {candidates.length > showCount && (
        <button className="btn-secondary w-full mt-3 text-sm" onClick={() => setShowCount(c => c + 15)}>
          さらに表示 ({candidates.length - showCount} 件)
        </button>
      )}
    </div>
  );
}
