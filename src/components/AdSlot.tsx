'use client';

import { cn } from '@/lib/utils';

interface Props {
  slot: string;
  className?: string;
}

/**
 * Google AdSense 広告枠プレースホルダー
 * AdSense 審査通過後に ins タグに置き換える
 */
export default function AdSlot({ slot, className }: Props) {
  if (process.env.NODE_ENV === 'production') return null; // 本番では後からAdSenseタグを挿入

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
