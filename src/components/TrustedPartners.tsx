'use client';

import { useLocale } from '@/context/LocaleContext';
import { usePartners } from '@/hooks/useSiteData';
import { useRef, useEffect, useState } from 'react';

/** Only attempt to load images from external URLs or the /uploads/ path. */
function isLoadableUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/uploads/');
}

function PartnerItem({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  const [imgFailed, setImgFailed] = useState(false);
  const canLoad = logoUrl && isLoadableUrl(logoUrl) && !imgFailed;

  if (canLoad) {
    return (
      <div className="w-36 sm:w-40 h-16 relative flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-75 hover:opacity-100 flex items-center justify-center px-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl!}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-4 flex items-center justify-center text-center">
      <span className="font-display text-sm sm:text-base font-semibold uppercase tracking-[0.14em] text-stone-600 dark:text-stone-300 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default function TrustedPartners() {
  const { locale } = useLocale();
  const [partners, loaded] = usePartners();
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const hasUploadedLogos = partners.some((p) => isLoadableUrl(p.logoUrl || ''));
  const useMarquee = hasUploadedLogos && partners.length >= 5;

  useEffect(() => {
    if (!useMarquee || !trackRef.current || partners.length === 0) return;
    const firstHalf = trackRef.current.querySelectorAll<HTMLElement>('[data-logo-item]');
    let total = 0;
    for (let i = 0; i < partners.length && i < firstHalf.length; i++) {
      total += firstHalf[i].getBoundingClientRect().width;
    }
    const gapPerItem = window.innerWidth >= 1024 ? 48 : window.innerWidth >= 640 ? 36 : 24;
    setTrackWidth(total + gapPerItem * partners.length);
  }, [partners, useMarquee]);

  if (loaded && partners.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 bg-[var(--surface)] dark:bg-stone-950 border-y border-stone-200 dark:border-stone-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-7">
          <div>
            <p className="section-kicker mb-1.5">
              {locale === 'bn' ? 'অংশীদার ও শিল্প খাত' : 'Clients & Industry Partners'}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">
              {locale === 'bn' ? 'বাংলাদেশের কারখানার আস্থা' : 'Trusted on factory floors across Bangladesh'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {locale === 'bn' ? '৩০০+ সক্রিয় কারখানা লাইন' : '300+ active factory lines nationwide'}
          </p>
        </div>

        {useMarquee ? (
          <div className="relative">
            <div className="flex overflow-hidden">
              <div
                ref={trackRef}
                className="flex gap-6 sm:gap-9 lg:gap-12 py-3 items-center"
                style={
                  trackWidth > 0
                    ? {
                        animation: `marquee-scroll ${partners.length * 3}s linear infinite`,
                        willChange: 'transform',
                      }
                    : undefined
                }
              >
                {[...partners, ...partners].map((partner, index) => (
                  <div key={`${partner.id}-${index}`} data-logo-item="">
                    <PartnerItem name={partner.name} logoUrl={partner.logoUrl} />
                  </div>
                ))}
              </div>
            </div>
            <div
              className="absolute inset-y-0 left-0 w-14 sm:w-24 bg-gradient-to-r from-[var(--surface)] dark:from-stone-950 to-transparent z-10 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-y-0 right-0 w-14 sm:w-24 bg-gradient-to-l from-[var(--surface)] dark:from-stone-950 to-transparent z-10 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="border border-stone-200 dark:border-stone-800 rounded-md grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800 bg-brand-paper/40 dark:bg-stone-900/50">
            {partners.map((partner) => (
              <PartnerItem key={partner.id} name={partner.name} logoUrl={partner.logoUrl} />
            ))}
          </div>
        )}
      </div>

      {useMarquee && (
        <style jsx global>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      )}
    </section>
  );
}
