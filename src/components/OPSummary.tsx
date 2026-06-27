'use client';

import { useStore } from '@/store';
import { calcTotals } from '@/lib/op-calc';
import { fmtPercent } from '@/lib/utils';

export default function OPSummary() {
  const charts = useStore(s => s.charts);
  const profile = useStore(s => s.profile);
  const profileOpPercent = useStore(s => s.profileOpPercent);
  const { totalOP: calcOP, totalMaxOP: calcMaxOP, percent: calcPercent } = calcTotals(charts);

  // profile の公式値を優先して使用
  const profileRawOP = profile?.over_power != null ? Number(profile.over_power) : null;
  const percent     = profileOpPercent ?? calcPercent;
  const totalOP     = profileRawOP ?? calcOP;
  // totalMaxOP を公式値から逆算（over_power / percent * 100）、なければ計算値
  const totalMaxOP  = (profileRawOP != null && percent > 0)
    ? profileRawOP / (percent / 100)
    : calcMaxOP;

  const barWidth = Math.min(100, percent);

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9670;</span> 現在のOP
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-bold tabular-nums text-sky-700">
              {fmtPercent(percent)}
            </span>
          </div>
          <div className="relative h-4 bg-sky-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 to-sky-500 rounded-full transition-all duration-700"
              style={{ width: `${barWidth}%` }}
            />
            {([97.5, 99.0, 99.5] as number[]).map(v => (
              <div
                key={v}
                className="absolute top-0 bottom-0 w-px bg-white/60"
                style={{ left: `${v}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-sky-400 mt-1">
            <span>0%</span>
            <span>97.5</span>
            <span>99.0</span>
            <span>99.5</span>
            <span>100%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center shrink-0">
          <Stat label="現在OP合計" value={totalOP.toFixed(2)} />
          <Stat label="理論値OP" value={totalMaxOP.toFixed(2)} />
          <Stat label="対象譜面数" value={`${charts.filter(e => e.score > 0).length}譜面`} />
          {profile?.rating != null && (
            <Stat label="レーティング" value={Number(profile.rating).toFixed(2)} />
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-sky-50 rounded-xl px-3 py-2">
      <p className="text-xs text-sky-500">{label}</p>
      <p className="font-bold text-sky-800 tabular-nums">{value}</p>
    </div>
  );
}
