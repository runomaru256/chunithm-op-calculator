import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHUNI OP Calculator',
  description: 'CHUNITHM Over Power 計算・目標達成支援ツール',
  keywords: ['CHUNITHM', 'OP', 'Over Power', 'チュウニズム', '目標'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
