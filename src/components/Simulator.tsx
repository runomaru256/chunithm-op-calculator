'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/store';
import { calcOP, calcTotals } from '@/lib/op-calc';
import { DIFF_COLOR, DIFF_LABEL, cn, fmtPercent, fmtScore } from '@/lib/utils';
import { Difficulty, ChartEntry } from '@/types';

export default function Simulator() {
  const charts = useStore(s => s.charts);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ChartEntry | null>(null);
  const [simScore, setSimScore] = useState(0);
  const [simFC, setSimFC] = useState(false);
  const [simAJ, setSimAJ] = useState(false);
  const [simAJC, setSimAJC] = useState(false);

  const { totalOP, totalMaxOP } = calcTotals(charts);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return charts
      .filter(e => e.title.toLowerCase().includes(q))
      .slice(0, 10);
  }, [charts, search]);

  function selectChart(e: ChartEntry) {
    setSelected(e);
    setSimScore(e.score);
    setSimFC(e.is_fc);
    setSimAJ(e.is_aj);
    setSimAJC(false);
    setSearch('');
  }

  const simOP = selected
    ? calcOP(selected.level, simScore, simFC, simAJ, simAJC)
    : 0;
  const opDelta = selected ? simOP - selected.currentOP : 0;
  const newTotal = totalOP + opDelta;
  const newPercent = totalMaxOP > 0 ? (newTotal / totalMaxOP) * 100 : 0;
  const currentPercent = totalMaxOP > 0 ? (totalOP / totalMaxOP) * 100 : 0;

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9654;</span> シミュレーター
      </h2>
      <p className="text-xs text-sky-400 mb-4">
        スコアを入力して、OP がどう変わるかを即計算します。
      </p>

      {/* 検索 */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="曲名で検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field"
        />
        {filtered.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 bg-white border border-sky-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {filtered.map(e => (
              <button
                key={`${e.id}-${e.difficulty}`}
                onClick={() => selectChart(e)}
                className="w-full text-left px-3 py-2 hover:bg-sky-50 text-sm flex items-center gap-2"
              >
                <span className={cn('text-xs font-bold text-white px-1.5 py-0.5 rounded', DIFF_COLOR[e.difficulty])}>
                  {DIFF_LABEL[e.difficulty]}
                </span>
                <span className="text-sky-900 truncate">{e.title}</span>
                <span className="text-xs text-sky-400 shrink-0">Lv.{e.level}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="space-y-4">
          <div className="bg-sky-50 rounded-xl p-3 flex items-center gap-3">
            <span className={cn('text-xs font-bold text-white px-2 py-1 rounded', DIFF_COLOR[selected.difficulty])}>
              {DIFF_LABEL[selected.difficulty]}
            </span>
            <div>
              <p className="font-semibold text-sky-900">{selected.title}</p>
              <p className="text-xs text-sky-500">定数 {selected.level} / 現在 {fmtScore(selected.score)} / {selected.currentOP.toFixed(2)} OP</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[160px]">
              <label className="text-xs text-sky-600 block mb-1">スコア</label>
              <input
                type="number"
                step="100"
                min="0"
                max="1010000"
                value={simScore}
                onChange={e => setSimScore(parseInt(e.target.value) || 0)}
                className="input-field"
              />
            </div>
            <div className="flex gap-3 mt-4">
              {([['FC', simFC, setSimFC], ['AJ', simAJ, setSimAJ], ['AJC', simAJC, setSimAJC]] as [string, boolean, (v: boolean) => void][]).map(([label, val, setter]) => (
                <label key={label} className="flex items-center gap-1 text-sm text-sky-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={val as boolean}
                    onChange={e => (setter as (v: boolean) => void)(e.target.checked)}
                    className="accent-sky-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* プリセット */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'SSS+', score: 1010000 },
              { label: 'SSS', score: 1007500 },
              { label: 'SS+', score: 1005000 },
              { label: 'SS', score: 1000000 },
            ].map(p => (
              <button key={p.label} onClick={() => setSimScore(p.score)} className="btn-secondary text-xs py-1">
                {p.label} ({fmtScore(p.score)})
              </button>
            ))}
          </div>

          {/* 結果 */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-sky-50 rounded-xl p-3">
              <p className="text-xs text-sky-500">シム後OP</p>
              <p className="font-bold text-sky-700 tabular-nums">{simOP.toFixed(2)}</p>
            </div>
            <div className="bg-sky-50 rounded-xl p-3">
              <p className="text-xs text-sky-500">OP変化</p>
              <p className={cn('font-bold tabular-nums', opDelta > 0 ? 'text-green-600' : opDelta < 0 ? 'text-red-500' : 'text-sky-400')}>
                {opDelta >= 0 ? '+' : ''}{opDelta.toFixed(2)}
              </p>
            </div>
            <div className="bg-sky-50 rounded-xl p-3">
              <p className="text-xs text-sky-500">全体OP%</p>
              <p className={cn('font-bold tabular-nums', opDelta > 0 ? 'text-green-600' : 'text-sky-700')}>
                {fmtPercent(newPercent)}
                {opDelta !== 0 && (
                  <span className="text-xs ml-1">({opDelta > 0 ? '+' : ''}{(newPercent - currentPercent).toFixed(4)})</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
