'use client';

import { useStore } from '@/store';
import { calcTotals, calcAchievementPatterns } from '@/lib/op-calc';
import { fmtPercent } from '@/lib/utils';

export default function AchievementPatterns() {
  const charts = useStore(s => s.charts);
  const goalPercent = useStore(s => s.goalPercent);
  const { totalOP, totalMaxOP, percent } = calcTotals(charts);

  if (percent >= goalPercent) return null;

  const patterns = calcAchievementPatterns(charts, totalOP, totalMaxOP, goalPercent);

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9670;</span> 達成パターン（目標 {goalPercent}%）
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {patterns.map((p, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 ${
              p.achievable
                ? 'border-sky-200 bg-gradient-to-br from-sky-50 to-white'
                : 'border-gray-200 bg-gray-50 opacity-50'
            }`}
          >
            <p className="font-bold text-sky-700 text-base">{p.label}</p>
            <p className="text-xs text-sky-500 mb-3">{p.desc}</p>
            {p.achievable ? (
              <>
                <p className="text-xs text-sky-600">達成後 OP%</p>
                <p className="text-2xl font-bold text-sky-700 tabular-nums">
                  {fmtPercent(p.percentAfter)}
                </p>
                {p.percentAfter >= goalPercent && (
                  <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    目標達成
                  </span>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-400">全譜面改善でも未達</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
