'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/store';
import { calcOP } from '@/lib/op-calc';
import { DIFF_COLOR, DIFF_LABEL, RANK_COLOR, cn, fmtScore, constToBucket } from '@/lib/utils';
import { ChartEntry, Difficulty } from '@/types';

type SortKey = 'efficiency' | 'opGap' | 'level' | 'toSSS';

const ALL_DIFFS: Difficulty[] = ['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'ULTIMA'];

export default function RecommendList() {
  const charts = useStore(s => s.charts);
  const globalDiffs = useStore(s => s.filterDifficulties);
  const filterLevelBuckets = useStore(s => s.filterLevelBuckets);
  const [sortKey, setSortKey] = useState<SortKey>('efficiency');
  const [asc, setAsc] = useState(false);
  const [localDiffs, setLocalDiffs] = useState<Difficulty[]>(globalDiffs);
  const [showCount, setShowCount] = useState(20);

  function toggleDiff(d: Difficulty) {
    setLocalDiffs(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d],
    );
  }

  const sorted = useMemo(() => {
    const filtered = charts.filter(
      e =>
        localDiffs.includes(e.difficulty) &&
        filterLevelBuckets.includes(constToBucket(e.level)) &&
        e.effectiveOpGap > 0.001 &&
        e.score < 1010000,
    );

    const cmp = (a: ChartEntry, b: ChartEntry): number => {
      switch (sortKey) {
        case 'efficiency': {
          const ea = a.effectiveOpGap / Math.max(a.toMAX + 1, 1);
          const eb = b.effectiveOpGap / Math.max(b.toMAX + 1, 1);
          return eb - ea;
        }
        case 'opGap':
          return b.effectiveOpGap - a.effectiveOpGap;
        case 'level':
          return b.level - a.level;
        case 'toSSS':
          return a.toSSS - b.toSSS;
        default:
          return 0;
      }
    };

    const result = [...filtered].sort(cmp);
    return asc ? result.reverse() : result;
  }, [charts, localDiffs, filterLevelBuckets, sortKey, asc]);

  return (
    <div className="card">
      {/* ヘッダー行 */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="section-title mb-0">
          <span className="text-sky-500">&#9650;</span> おすすめ伸ばし対象
        </h2>
        <div className="flex gap-2 flex-wrap items-center">
          {/* ソートキー */}
          {([
            ['efficiency', '効率順'],
            ['opGap', 'OP差順'],
            ['level', '定数順'],
            ['toSSS', 'SSS近い順'],
          ] as [SortKey, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => {
                if (sortKey === k) setAsc(a => !a);
                else { setSortKey(k); setAsc(false); }
              }}
              className={cn(
                'text-xs px-3 py-1 rounded-full border transition-colors flex items-center gap-1',
                sortKey === k
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'border-sky-200 text-sky-600 hover:bg-sky-50',
              )}
            >
              {label}
              {sortKey === k && <span>{asc ? '↑' : '↓'}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 難易度フィルター */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {ALL_DIFFS.map(d => (
          <button
            key={d}
            onClick={() => toggleDiff(d)}
            className={cn(
              'text-xs font-bold px-2 py-1 rounded border transition-all',
              localDiffs.includes(d)
                ? cn(DIFF_COLOR[d], 'text-white border-transparent shadow-sm')
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400',
            )}
          >
            {DIFF_LABEL[d]}
          </button>
        ))}
      </div>

      <p className="text-xs text-sky-400 mb-3">
        {sorted.length} 件（MAX 達成済みを除く）
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sky-50 text-sky-700 text-xs">
              <th className="text-left px-2 py-2 rounded-l-lg">曲名</th>
              <th className="px-2 py-2">難度</th>
              <th className="px-2 py-2">定数</th>
              <th className="px-2 py-2">現スコア</th>
              <th className="px-2 py-2">ランク</th>
              <th className="px-2 py-2">現OP</th>
              <th className="px-2 py-2 rounded-r-lg">あとX点でSSS→実効OP+</th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, showCount).map((e, i) => (
              <RecommendRow key={`${e.id}-${e.difficulty}`} entry={e} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length > showCount && (
        <button
          className="btn-secondary w-full mt-3 text-sm"
          onClick={() => setShowCount(c => c + 20)}
        >
          さらに表示 ({sorted.length - showCount} 件)
        </button>
      )}
    </div>
  );
}

function RecommendRow({ entry: e, index }: { entry: ChartEntry; index: number }) {
  return (
    <tr className={cn('border-b border-sky-50 hover:bg-sky-50/50 transition-colors', index % 2 === 0 ? '' : 'bg-sky-50/20')}>
      <td className="px-2 py-2 max-w-[140px] truncate font-medium text-sky-900">
        {e.isActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 mr-1 mb-0.5" title="現在計上中" />}
        {e.title}
      </td>
      <td className="px-2 py-2 text-center">
        <span className={cn('text-xs font-bold text-white px-1.5 py-0.5 rounded', DIFF_COLOR[e.difficulty])}>
          {DIFF_LABEL[e.difficulty]}
        </span>
      </td>
      <td className="px-2 py-2 text-center tabular-nums">{e.level.toFixed(1)}</td>
      <td className="px-2 py-2 text-center tabular-nums text-xs">{fmtScore(e.score)}</td>
      <td className={cn('px-2 py-2 text-center font-bold text-xs', RANK_COLOR[e.rank])}>{e.rank}</td>
      <td className="px-2 py-2 text-center tabular-nums">{e.currentOP.toFixed(2)}</td>
      <td className="px-2 py-2 text-xs space-y-0.5">
        {e.toSSS > 0 && (
          <span className="block text-sky-600">
            +{fmtScore(e.toSSS)}pt→SSS <span className="font-bold">
              +{(calcOP(e.level, 1007500, e.is_fc, e.is_aj) - e.currentOP).toFixed(2)}OP
            </span>
          </span>
        )}
        {e.toSSSPlus > 0 && (
          <span className="block text-orange-500">
            +{fmtScore(e.toSSSPlus)}pt→SSS+ <span className="font-bold">
              +{(calcOP(e.level, 1009000, e.is_fc, e.is_aj) - e.currentOP).toFixed(2)}OP
            </span>
          </span>
        )}
        {e.toMAX > 0 && (
          <span className="block text-fuchsia-600">
            +{fmtScore(e.toMAX)}pt→MAX <span className="font-bold">
              +{(calcOP(e.level, 1010000, e.is_fc, e.is_aj) - e.currentOP).toFixed(2)}OP
            </span>
          </span>
        )}
        <span className="block text-purple-500">
          理論値まで実効 <span className="font-bold">+{e.effectiveOpGap.toFixed(2)}</span>
        </span>
      </td>
    </tr>
  );
}
