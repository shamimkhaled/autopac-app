'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({ slot, format = 'auto', style, className }: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`ad-container my-8 overflow-hidden flex justify-center bg-gray-50/50 rounded-xl border border-gray-100 ${className}`}>
      {/* Placeholder for Development */}
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-300 absolute top-2 right-2">Advertisement</div>
      
      {/* Actual AdSense Tag */}
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', minWidth: '300px', minHeight: '100px' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with actual ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
