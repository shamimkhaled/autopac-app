'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

export default function AdSense({ slot, format = 'auto', style, className }: AdSenseProps) {
  const adRef = useRef<boolean>(false);

  useEffect(() => {
    if (!PUBLISHER_ID || adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({} as Record<string, unknown>);
      adRef.current = true;
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  if (!PUBLISHER_ID) {
    return (
      <div className={`ad-container my-8 flex items-center justify-center bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 min-h-[100px] ${className}`}>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 dark:text-slate-700">
          Advertisement
        </span>
      </div>
    );
  }

  return (
    <div className={`ad-container my-8 overflow-hidden flex flex-col items-center justify-center bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800 relative min-h-[100px] ${className}`}>
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-300 dark:text-slate-700 absolute top-2 right-2 z-0">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', width: '100%', minHeight: '100px' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
