'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';
import { fetchRecords, fetchMusic, fetchProfile } from '@/lib/chunirec';
import { mergeData, calcTotals } from '@/lib/op-calc';
import { addHistoryEntry, loadHistory, loadTodos, loadUsernames, saveUsername } from '@/lib/storage';

export default function UserInput() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const store = useStore();

  // 外部クリックで候補を閉じる
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleInputChange(v: string) {
    setInput(v);
    const all = loadUsernames();
    const matched = v ? all.filter(n => n.toLowerCase().includes(v.toLowerCase())) : all;
    setSuggestions(matched);
    setShowSuggestions(matched.length > 0);
  }

  function handleFocus() {
    const all = loadUsernames();
    if (all.length > 0) {
      const matched = input ? all.filter(n => n.toLowerCase().includes(input.toLowerCase())) : all;
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    }
  }

  function selectSuggestion(name: string) {
    setInput(name);
    setShowSuggestions(false);
  }

  async function handleLoad(nameOverride?: string) {
    const name = (nameOverride ?? input).trim();
    if (!name) return;

    store.setIsLoading(true);
    store.setError(null);
    setShowSuggestions(false);

    try {
      const [records, musics, profile] = await Promise.all([
        fetchRecords(name),
        fetchMusic(),
        fetchProfile(name),
      ]);

      const charts = mergeData(musics, records);
      store.setCharts(charts);
      store.setProfile(profile);
      store.setUserName(name);

      // chunirec の公式 OP% をストアに保持（0〜1 の小数 or 0〜100 のどちらも対応）
      if (profile.over_power_progress != null) {
        const raw = Number(profile.over_power_progress);
        store.setProfileOpPercent(raw > 1 ? raw : raw * 100);
      } else {
        store.setProfileOpPercent(null);
      }

      const { totalOP, totalMaxOP, percent } = calcTotals(charts);
      addHistoryEntry({
        date: new Date().toISOString(),
        totalOP,
        totalMaxOP,
        opPercent: percent,
        userName: name,
      });
      store.setHistory(loadHistory());
      store.setTodos(loadTodos());

      saveUsername(name);
    } catch (e) {
      store.setError(e instanceof Error ? e.message : '不明なエラー');
    } finally {
      store.setIsLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="text-sky-500">&#9654;</span> ユーザーデータ読み込み
      </h2>
      <div className="flex gap-2">
        <div ref={wrapperRef} className="relative flex-1">
          <input
            type="text"
            className="input-field w-full"
            placeholder="chunirec ユーザー名"
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={e => {
              if (e.key === 'Enter') handleLoad();
              if (e.key === 'Escape') setShowSuggestions(false);
            }}
            disabled={store.isLoading}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-sky-200 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map(name => (
                <li
                  key={name}
                  className="px-3 py-2 text-sm text-sky-800 hover:bg-sky-50 cursor-pointer"
                  onMouseDown={() => selectSuggestion(name)}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="btn-primary whitespace-nowrap"
          onClick={() => handleLoad()}
          disabled={store.isLoading || !input.trim()}
        >
          {store.isLoading ? '読み込み中…' : '読み込む'}
        </button>
      </div>

      {store.error && (
        <p className="mt-3 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
          {store.error}
        </p>
      )}

      <p className="mt-2 text-xs text-sky-400">
        chunirec でスコアを公開設定にする必要があります。
      </p>
    </div>
  );
}
