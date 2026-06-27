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

function LandingContent() {
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-bold text-sky-700 mb-3">CHUNI OP Calculator とは？</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          CHUNITHMのOver Power（OP）を計算・分析する非公式ツールです。
          chunirecに登録したスコアデータをもとに、現在のOP値・達成率・ポゼッション状況をリアルタイムで確認できます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: '📊', title: 'OP計算・達成率表示', desc: '現在のOP合計と最大OP・達成率をリアルタイム表示。目標%まであと何曲必要かも自動計算します。' },
          { icon: '🏆', title: 'ポゼッション判定', desc: '銀・金・鉑・虹ポゼッションの達成状況と、あと何曲S/SS/SS+が必要かを一覧表示。' },
          { icon: '🎯', title: 'おすすめ譜面提案', desc: '「OP効率が高い順」「SSS近い順」など複数のソートでOP伸ばし対象を素早く特定できます。' },
          { icon: '🔬', title: 'シミュレーター', desc: 'スコアを仮設定してOPがどう変化するかシミュレート。目標譜面の優先順位決めに役立ちます。' },
        ].map(f => (
          <div key={f.title} className="card">
            <p className="text-2xl mb-2">{f.icon}</p>
            <h3 className="font-bold text-sky-700 text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="card bg-sky-50 border border-sky-200">
        <h3 className="font-bold text-sky-700 text-sm mb-2">使い方</h3>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li><a href="https://chunirec.net" target="_blank" rel="noopener noreferrer" className="text-sky-500 underline">chunirec.net</a> でスコアを公開設定にする</li>
          <li>上のフォームに chunirec ユーザー名を入力して「読み込む」</li>
          <li>OP計算結果・おすすめ譜面が自動表示されます</li>
        </ol>
      </div>
    </div>
  );
}

export default function Home() {
  const charts = useStore(s => s.charts);
  const hasData = charts.length > 0;

  return (
    <div className="min-h-screen bg-sky-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        <UserInput />

        {!hasData && <LandingContent />}

        {hasData && (
          <>
            <AdSlot slot="top" />
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

            <AdSlot slot="bottom" />
          </>
        )}
      </main>

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
