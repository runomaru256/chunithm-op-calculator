'use client';

import { useStore } from '@/store';
import { calcTotals, calcAchievementPatterns } from '@/lib/op-calc';
import { fmtPercent } from '@/lib/utils';

export default function GoalSection() {
  const charts = useStore(s => s.charts);
  const goalPercent = useStore(s => s.goalPercent);
  const setGoalPercent = useStore(s => s.setGoalPercent);
  const { totalOP, totalMaxOP, percent } = calcTotals(charts);

  const patterns = calcAchievementPatterns(charts, totalOP, totalMaxOP, goalPercent);
  const alreadyAchieved = percent >= goalPercent;

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9733;</span> 目標OP設定
      </h2>

      <div className="flex flex-wrap gap-3 items-center mb-4">
        <label className="text-sm text-sky-700 font-semibold">目標OP%：</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={goalPercent}
          onChange={e => setGoalPercent(parseFloat(e.target.value) || 0)}
          className="input-field w-32"
        />
        <div className="flex gap-2 flex-wrap">
          {[97.5, 99.0, 99.5, 100].map(v => (
            <button
              key={v}
              onClick={() => setGoalPercent(v)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                goalPercent === v
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'border-sky-200 text-sky-600 hover:bg-sky-50'
              }`}
            >
              {v}%
            </button>
          ))}
        </div>
      </div>

      {alreadyAchieved ? (
        <p className="text-green-600 font-semibold bg-green-50 rounded-xl px-4 py-3 text-sm">
          目標 {goalPercent}% は達成済みです！ 現在: {fmtPercent(percent)}
        </p>
      ) : (
        <>
          <p className="text-sm text-sky-600 mb-3">
            現在 <span className="font-bold">{fmtPercent(percent)}</span> →
            目標 <span className="font-bold">{goalPercent}%</span>
            （あと <span className="font-bold text-red-500">{(goalPercent - percent).toFixed(4)}%</span>）
          </p>

          {/* 達成パターン */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {patterns.map((p, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  p.achievable
                    ? 'border-sky-200 bg-sky-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <p className="font-bold text-sky-700 text-sm">{p.label}</p>
                <p className="text-xs text-sky-500 mb-2">{p.desc}</p>
                {p.achievable ? (
                  <p className="text-xs text-sky-800">
                    達成後: <span className="font-bold">{fmtPercent(p.percentAfter)}</span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">全譜面改善でも未達</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
