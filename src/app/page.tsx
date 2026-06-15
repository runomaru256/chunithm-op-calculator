'use client';

import { useStore } from '@/store';
import Header from '@/components/Header';
import UserInput from '@/components/UserInput';
import OPSummary from '@/components/OPSummary';
import GoalSection from '@/components/GoalSection';
import PossessionStatus from '@/components/PossessionStatus';
import AchievementPatterns from '@/components/AchievementPatterns';
import DifficultyFilter from '@/components/DifficultyFilter';
import RecommendList from '@/components/RecommendList';
import BorderCandidates from '@/components/BorderCandidates';
import OPBreakdown from '@/components/OPBreakdown';
import Simulator from '@/components/Simulator';
import OPHistory from '@/components/OPHistory';
import AdSlot from '@/components/AdSlot';

export default function Home() {
  const charts = useStore(s => s.charts);
  const hasData = charts.length > 0;

  return (
    <div className="min-h-screen bg-sky-50">
      <Header />

      <AdSlot slot="top" className="max-w-5xl mx-auto px-4 mt-2" />

      <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        <UserInput />

        {hasData && (
          <>
            <OPSummary />
            <GoalSection />
            <PossessionStatus />

            <AdSlot slot="mid1" />

            <DifficultyFilter />
            <RecommendList />
            <BorderCandidates />

            <AdSlot slot="mid2" />

            <OPBreakdown />
            <Simulator />
            <OPHistory />
          </>
        )}
      </main>

      <AdSlot slot="bottom" className="max-w-5xl mx-auto px-4 mb-2" />

      <footer className="bg-sky-800 text-sky-100 text-center py-4 text-sm mt-6">
        <p className="font-semibold">CHUNI OP Calculator</p>
        <p className="text-sky-300 text-xs mt-1">
          chunirec API を使用 / 非公式ツール / CHUNITHM は株式会社セガの商標です
        </p>
        <p className="mt-2">
          <a href="/privacy" className="text-sky-400 text-xs hover:underline">プライバシーポリシー</a>
        </p>
      </footer>
    </div>
  );
}
