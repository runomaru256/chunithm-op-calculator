import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHUNI OP Calculator',
  description: 'CHUNITHM Over Power 計算・目標達成支援ツール',
  keywords: ['CHUNITHM', 'OP', 'Over Power', 'チュウニズム', '目標'],
  other: {
    'google-adsense-account': 'ca-pub-2828611180071453',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2828611180071453"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
