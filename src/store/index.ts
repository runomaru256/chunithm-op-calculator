'use client';

import { create } from 'zustand';
import { ChartEntry, Difficulty, OPHistoryEntry, Profile } from '@/types';

interface AppState {
  userName: string;
  setUserName: (v: string) => void;

  profile: Profile | null;
  setProfile: (v: Profile | null) => void;

  charts: ChartEntry[];
  setCharts: (v: ChartEntry[]) => void;

  isLoading: boolean;
  setIsLoading: (v: boolean) => void;

  error: string | null;
  setError: (v: string | null) => void;

  goalPercent: number;
  setGoalPercent: (v: number) => void;

  filterDifficulties: Difficulty[];
  setFilterDifficulties: (v: Difficulty[]) => void;

  filterLevelBuckets: string[];
  setFilterLevelBuckets: (v: string[]) => void;

  history: OPHistoryEntry[];
  setHistory: (v: OPHistoryEntry[]) => void;

  todos: Record<string, boolean>;
  setTodos: (v: Record<string, boolean>) => void;
}

export const useStore = create<AppState>((set) => ({
  userName: '',
  setUserName: (userName) => set({ userName }),

  profile: null,
  setProfile: (profile) => set({ profile }),

  charts: [],
  setCharts: (charts) => set({ charts }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  goalPercent: 99.0,
  setGoalPercent: (goalPercent) => set({ goalPercent }),

  filterDifficulties: ['MASTER', 'ULTIMA'],
  setFilterDifficulties: (filterDifficulties) => set({ filterDifficulties }),

  filterLevelBuckets: ['13', '13+', '14', '14+', '15', '15+'],
  setFilterLevelBuckets: (filterLevelBuckets) => set({ filterLevelBuckets }),

  history: [],
  setHistory: (history) => set({ history }),

  todos: {},
  setTodos: (todos) => set({ todos }),
}));
