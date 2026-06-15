'use client';

import { useMemo } from 'react';
import { useStore } from '@/store';
import { calcTotals } from '@/lib/op-calc';
import { saveTodos } from '@/lib/storage';
import { DIFF_COLOR, DIFF_LABEL, cn, fmtScore } from '@/lib/utils';

export default function TodoList() {
  const charts = useStore(s => s.charts);
  const goalPercent = useStore(s => s.goalPercent);
  const todos = useStore(s => s.todos);
  const setTodos = useStore(s => s.setTodos);
  const { totalOP, totalMaxOP, percent } = calcTotals(charts);

  // 目標OP達成のためのToDoリスト自動生成
  // 効率順（opGap / toMAX）上位の未達成譜面
  const todoItems = useMemo(() => {
    if (percent >= goalPercent) return [];
    const targetOP = (goalPercent / 100) * totalMaxOP;
    const needed = targetOP - totalOP;

    const candidates = [...charts]
      .filter(e => e.effectiveOpGap > 0.01 && e.score < 1010000)
      .sort((a, b) => {
        const ea = a.effectiveOpGap / Math.max(a.toMAX + 1, 1);
        const eb = b.effectiveOpGap / Math.max(b.toMAX + 1, 1);
        return eb - ea;
      });

    let acc = 0;
    const items = [];
    for (const c of candidates) {
      if (acc >= needed) break;
      items.push(c);
      acc += c.effectiveOpGap;
    }
    return items;
  }, [charts, goalPercent, totalOP, totalMaxOP, percent]);

  function toggleTodo(key: string) {
    const next = { ...todos, [key]: !todos[key] };
    setTodos(next);
    saveTodos(next);
  }

  const doneCount = todoItems.filter(e => todos[`${e.id}-${e.difficulty}`]).length;

  if (todoItems.length === 0 && percent >= goalPercent) {
    return (
      <div className="card">
        <h2 className="section-title">
          <span className="text-sky-500">&#10003;</span> 目標達成 ToDoリスト
        </h2>
        <p className="text-green-600 font-semibold">目標 {goalPercent}% を達成しています！</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="section-title mb-0">
          <span className="text-sky-500">&#10003;</span> 目標達成 ToDoリスト
        </h2>
        <span className="text-sm text-sky-500">
          {doneCount}/{todoItems.length} 完了
        </span>
      </div>

      {todoItems.length === 0 ? (
        <p className="text-sky-400 text-sm">達成できる候補がありません。</p>
      ) : (
        <div className="space-y-2">
          {todoItems.map(e => {
            const key = `${e.id}-${e.difficulty}`;
            const done = !!todos[key];
            return (
              <label
                key={key}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border',
                  done
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-sky-100 hover:bg-sky-50',
                )}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleTodo(key)}
                  className="accent-sky-500 w-4 h-4 shrink-0"
                />
                <span
                  className={cn(
                    'text-xs font-bold text-white px-1.5 py-0.5 rounded shrink-0',
                    DIFF_COLOR[e.difficulty],
                  )}
                >
                  {DIFF_LABEL[e.difficulty]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium truncate', done ? 'line-through text-gray-400' : 'text-sky-900')}>
                    {e.title}
                  </p>
                  <p className="text-xs text-sky-400">
                    Lv.{e.level} / 現在 {fmtScore(e.score)} / 実効OP +{e.effectiveOpGap.toFixed(2)}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
