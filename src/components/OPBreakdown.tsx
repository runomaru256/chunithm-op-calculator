'use client';

import { useMemo } from 'react';
import { useStore } from '@/store';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Rank } from '@/types';

const LEVEL_RANGES = [
  { label: '〜12', min: 0,    max: 12.99 },
  { label: '13帯', min: 13.0, max: 13.99 },
  { label: '14帯', min: 14.0, max: 14.99 },
  { label: '15+',  min: 15.0, max: 99 },
];

const RANK_GROUPS: { label: string; ranks: Rank[] }[] = [
  { label: 'S以下',  ranks: ['D', 'C', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA', 'S'] },
  { label: 'S+〜SS', ranks: ['S+', 'SS'] },
  { label: 'SS+',    ranks: ['SS+'] },
  { label: 'SSS',    ranks: ['SSS'] },
  { label: 'SSS+',   ranks: ['SSS+'] },
  { label: 'MAX',    ranks: ['MAX'] },
];

const RANK_COLORS = ['#94a3b8', '#22c55e', '#eab308', '#f97316', '#ef4444', '#d946ef'];

const DIFF_COLORS: Record<string, string> = {
  BASIC:    '#22c55e',
  ADVANCED: '#eab308',
  EXPERT:   '#ef4444',
  MASTER:   '#9333ea',
  ULTIMA:   '#1f2937',
};

export default function OPBreakdown() {
  const charts = useStore(s => s.charts);

  // 各楽曲の最高OP難易度のみ（isActive）かつプレイ済み（score > 0）
  const active = useMemo(
    () => charts.filter(e => e.isActive && e.score > 0),
    [charts],
  );

  const levelData = useMemo(() =>
    LEVEL_RANGES.map(r => {
      const inRange = active.filter(e => e.level >= r.min && e.level <= r.max);
      return {
        label: r.label,
        op:    inRange.reduce((s, e) => s + e.currentOP, 0),
        maxOp: inRange.reduce((s, e) => s + e.maxOP, 0),
      };
    })
  , [active]);

  const rankData = useMemo(() =>
    RANK_GROUPS.map((g, i) => ({
      label: g.label,
      value: active.filter(e => g.ranks.includes(e.rank)).reduce((s, e) => s + e.currentOP, 0),
      color: RANK_COLORS[i],
    })).filter(d => d.value > 0)
  , [active]);

  const diffData = useMemo(() =>
    (['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'ULTIMA'] as const).map(d => ({
      label: d,
      value: active.filter(e => e.difficulty === d).reduce((s, e) => s + e.currentOP, 0),
      color: DIFF_COLORS[d],
    })).filter(d => d.value > 0)
  , [active]);

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9643;</span> OP内訳の可視化
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 定数帯別 バーチャート */}
        <div>
          <p className="text-xs text-sky-600 font-semibold mb-2 text-center">定数帯別 OP</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={levelData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v: number) => v.toFixed(1)}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="maxOp" fill="#e0f2fe" name="理論値" />
              <Bar dataKey="op" fill="#0ea5e9" name="現在OP" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ランク別 パイ */}
        <div>
          <p className="text-xs text-sky-600 font-semibold mb-2 text-center">ランク別 OP分布</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={rankData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={70}>
                {rankData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toFixed(1)} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 難易度別 パイ */}
        <div>
          <p className="text-xs text-sky-600 font-semibold mb-2 text-center">難易度別 OP貢献</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={diffData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={70}>
                {diffData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toFixed(1)} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
