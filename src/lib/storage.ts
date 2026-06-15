import { OPHistoryEntry } from '@/types';

const HISTORY_KEY = 'chuniop_history';
const TODO_KEY = 'chuniop_todos';
const USERNAMES_KEY = 'chuniop_usernames';

export function loadHistory(): OPHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveHistory(entries: OPHistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function addHistoryEntry(entry: OPHistoryEntry): void {
  const history = loadHistory();
  // 同日同ユーザーは上書き
  const idx = history.findIndex(
    h => h.userName === entry.userName && h.date.slice(0, 10) === entry.date.slice(0, 10),
  );
  if (idx >= 0) {
    history[idx] = entry;
  } else {
    history.push(entry);
  }
  // 最大180件
  if (history.length > 180) history.splice(0, history.length - 180);
  saveHistory(history);
}

export function loadTodos(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(TODO_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function saveTodos(todos: Record<string, boolean>): void {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

export function loadUsernames(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERNAMES_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveUsername(name: string): void {
  const names = loadUsernames().filter(n => n !== name);
  names.unshift(name);
  localStorage.setItem(USERNAMES_KEY, JSON.stringify(names.slice(0, 10)));
}
