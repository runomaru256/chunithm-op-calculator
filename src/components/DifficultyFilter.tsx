'use client';

import { useStore } from '@/store';
import { Difficulty } from '@/types';
import { DIFF_COLOR, DIFF_LABEL, LEVEL_BUCKETS, cn } from '@/lib/utils';

const ALL_DIFFS: Difficulty[] = ['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'ULTIMA'];

export default function DifficultyFilter() {
  const filterDifficulties = useStore(s => s.filterDifficulties);
  const setFilterDifficulties = useStore(s => s.setFilterDifficulties);
  const filterLevelBuckets = useStore(s => s.filterLevelBuckets);
  const setFilterLevelBuckets = useStore(s => s.setFilterLevelBuckets);

  function toggleDiff(d: Difficulty) {
    setFilterDifficulties(
      filterDifficulties.includes(d)
        ? filterDifficulties.filter(x => x !== d)
        : [...filterDifficulties, d],
    );
  }

  function toggleBucket(b: string) {
    setFilterLevelBuckets(
      filterLevelBuckets.includes(b)
        ? filterLevelBuckets.filter(x => x !== b)
        : [...filterLevelBuckets, b],
    );
  }

  function selectAllBuckets() {
    setFilterLevelBuckets([...LEVEL_BUCKETS]);
  }

  function clearBuckets() {
    setFilterLevelBuckets([]);
  }

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9698;</span> フィルター
      </h2>

      {/* 難易度フィルター */}
      <div className="mb-4">
        <p className="text-xs text-sky-500 font-semibold mb-2">難易度</p>
        <div className="flex gap-2 flex-wrap">
          {ALL_DIFFS.map(d => (
            <button
              key={d}
              onClick={() => toggleDiff(d)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border font-bold transition-all',
                filterDifficulties.includes(d)
                  ? cn(DIFF_COLOR[d], 'text-white border-transparent shadow-sm')
                  : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400',
              )}
            >
              {DIFF_LABEL[d]}
            </button>
          ))}
        </div>
      </div>

      {/* 定数レベルフィルター */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <p className="text-xs text-sky-500 font-semibold">定数レベル</p>
          <button
            onClick={selectAllBuckets}
            className="text-xs text-sky-500 hover:text-sky-700 underline"
          >
            全選択
          </button>
          <button
            onClick={clearBuckets}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            クリア
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LEVEL_BUCKETS.map(b => {
            const isPlus = b.endsWith('+');
            const selected = filterLevelBuckets.includes(b);
            return (
              <button
                key={b}
                onClick={() => toggleBucket(b)}
                className={cn(
                  'text-xs font-bold px-2 py-1 rounded border transition-all min-w-[2.5rem] text-center',
                  selected
                    ? isPlus
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : 'bg-sky-400 text-white border-sky-400 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-300 hover:border-sky-300 hover:text-sky-600',
                )}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
