'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const SLOT_IDS: Record<string, string> = {
  top:    '7525729233',
  mid1:   '5372806242',
  mid2:   '7337192820',
  bottom: '9940139581',
};

const CLIENT_ID = 'ca-pub-2828611180071453';

declare global {
  interface Window { adsbygoogle: unknown[] }
}

interface Props {
  slot: string;
  className?: string;
}

export default function AdSlot({ slot, className }: Props) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  // 開発環境はプレースホルダー表示
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div
        className={cn(
          'bg-sky-50 border border-dashed border-sky-200 rounded-lg flex items-center justify-center text-sky-300 text-xs py-2',
          slot === 'top' || slot === 'bottom' ? 'h-12' : 'h-24',
          className,
        )}
      >
        広告枠 [{slot}]
      </div>
    );
  }

  const slotId = SLOT_IDS[slot];
  if (!slotId) return null;

  return (
    <div className={cn('text-center overflow-hidden', className)}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
