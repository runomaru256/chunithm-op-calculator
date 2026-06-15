'use client';

import { useStore } from '@/store';
import { calcTotals, calcOPPercent } from '@/lib/op-calc';
import { fmtPercent } from '@/lib/utils';

export default function Header() {
  const charts = useStore(s => s.charts);
  const userName = useStore(s => s.userName);
  const { totalOP, totalMaxOP, percent } = calcTotals(charts);
  const hasData = charts.length > 0;

  return (
    <header className="bg-gradient-to-r from-sky-700 to-sky-500 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm select-none">
            OP
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">CHUNI OP Calculator</h1>
            <p className="text-sky-200 text-xs">CHUNITHM Over Power 計算ツール</p>
          </div>
        </div>

        {hasData && (
          <div className="text-right hidden sm:block">
            <p className="text-sky-200 text-xs">{userName}</p>
            <p className="font-bold text-xl tabular-nums">{fmtPercent(percent)}</p>
            <p className="text-sky-200 text-xs tabular-nums">
              {totalOP.toFixed(2)} / {totalMaxOP.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
