'use client';

import { useStore } from '@/store';
import { calcTotals, calcPossession } from '@/lib/op-calc';
import { DIFF_LABEL, DIFF_COLOR, fmtPercent } from '@/lib/utils';
import { PossessionTier } from '@/types';

const TIERS: { key: PossessionTier; label: string; color: string; req: string }[] = [
  { key: 'silver',   label: '銀ポゼ', color: 'from-gray-300 to-gray-400',       req: 'MAS+ULT 全曲S以上' },
  { key: 'gold',     label: '金ポゼ', color: 'from-yellow-300 to-yellow-400',    req: 'MAS+ULT 全曲S+以上 & OP 97.5%+' },
  { key: 'platinum', label: '鉑ポゼ', color: 'from-sky-300 to-cyan-400',         req: 'MAS+ULT 全曲SS以上 & OP 99.00%+' },
  { key: 'rainbow',  label: '虹ポゼ', color: 'from-pink-400 via-yellow-400 to-sky-400', req: 'MAS+ULT 全曲SS+以上 & OP 99.50%+' },
];

export default function PossessionStatus() {
  const charts = useStore(s => s.charts);
  const { percent } = calcTotals(charts);
  const poss = calcPossession(charts, percent);

  const missingMap: Record<PossessionTier, typeof charts> = {
    none: [],
    silver: poss.silverMissing,
    gold: poss.goldMissing,
    platinum: poss.platinumMissing,
    rainbow: poss.rainbowMissing,
  };

  const achievedMap: Record<PossessionTier, boolean> = {
    none: false,
    silver: poss.silverOk,
    gold: poss.goldOk,
    platinum: poss.platinumOk,
    rainbow: poss.rainbowOk,
  };

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9679;</span> ポゼッション達成率
      </h2>

      <div className="mb-3">
        <span className="text-sm text-sky-600">現在のポゼッション: </span>
        <TierBadge tier={poss.tier} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TIERS.map(({ key, label, color, req }) => {
          const ok = achievedMap[key];
          const missing = missingMap[key];
          return (
            <div
              key={key}
              className={`rounded-xl border p-3 ${ok ? 'border-sky-300 bg-sky-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className={`text-xs font-bold bg-gradient-to-r ${color} text-transparent bg-clip-text mb-1`}>
                {label}
              </div>
              <p className="text-xs text-gray-500 mb-2 leading-tight">{req}</p>
              {ok ? (
                <span className="text-xs text-green-600 font-semibold">✓ 達成</span>
              ) : (
                <span className="text-xs text-red-500">
                  未達 ({missing.slice(0, 3).map(e => e.title.slice(0, 6)).join(', ')}{missing.length > 3 ? `... 計${missing.length}譜面` : `など ${missing.length}譜面`})
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 金ポゼ OP不足の場合 */}
      {!poss.goldOk && poss.goldMissing.length === 0 && (
        <p className="mt-3 text-sm text-yellow-600">
          スコアは条件クリア。OP {fmtPercent(percent)} → 97.5% が必要です。
        </p>
      )}
    </div>
  );
}

function TierBadge({ tier }: { tier: PossessionTier }) {
  const map: Record<PossessionTier, string> = {
    none: 'text-gray-400',
    silver: 'text-gray-500 font-bold',
    gold: 'text-yellow-500 font-bold',
    platinum: 'text-sky-500 font-bold',
    rainbow: 'bg-gradient-to-r from-pink-500 via-yellow-500 to-sky-500 text-transparent bg-clip-text font-bold',
  };
  const labels: Record<PossessionTier, string> = {
    none: 'なし',
    silver: '銀ポゼッション',
    gold: '金ポゼッション',
    platinum: '鉑ポゼッション',
    rainbow: '虹ポゼッション',
  };
  return <span className={map[tier]}>{labels[tier]}</span>;
}
