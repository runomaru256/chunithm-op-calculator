'use client';

import { useStore } from '@/store';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { fmtPercent } from '@/lib/utils';

export default function OPHistory() {
  const history = useStore(s => s.history);
  const userName = useStore(s => s.userName);

  const userHistory = history
    .filter(h => h.userName === userName)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(h => ({
      date: h.date.slice(0, 10),
      op: parseFloat(h.opPercent.toFixed(4)),
    }));

  if (userHistory.length < 2) {
    return (
      <div className="card">
        <h2 className="section-title">
          <span className="text-sky-500">&#9203;</span> OP推移グラフ
        </h2>
        <p className="text-sm text-sky-400">
          {userHistory.length === 0
            ? 'データがまだありません。今回のデータから記録が始まります。'
            : 'もう一度ロードするとグラフが表示されます（2点以上必要）。'}
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9203;</span> OP推移グラフ
      </h2>
      <p className="text-xs text-sky-400 mb-4">{userHistory.length} 件の記録</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={userHistory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 10 }}
            tickFormatter={(v: number) => v.toFixed(2) + '%'}
          />
          <Tooltip
            formatter={(v: number) => [fmtPercent(v), 'OP%']}
            contentStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="op"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ r: 3, fill: '#0ea5e9' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
