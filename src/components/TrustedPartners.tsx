'use client';

import { useLocale } from '@/context/LocaleContext';
import { usePartners } from '@/hooks/useSiteData';
import { useRef, useEffect, useState } from 'react';

/** Only attempt to load images from external URLs or the /uploads/ path.
 *  Legacy seed data uses /images/partners/*.png which don't exist on disk —
 *  rendering those as <img> causes 404 console errors with no visual benefit. */
function isLoadableUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/uploads/');
}

function PartnerLogo({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  const [imgFailed, setImgFailed] = useState(false);
  const canLoad = logoUrl && isLoadableUrl(logoUrl) && !imgFailed;

  return (
    <div className="w-36 sm:w-40 h-20 sm:h-24 relative flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 flex items-center justify-center p-4 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50">
      {canLoad ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logoUrl!}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-xs font-black text-gray-400 uppercase tracking-wider text-center leading-tight">
          {name}
        </span>
      )}
    </div>
  );
}

export default function TrustedPartners() {
  const { locale } = useLocale();
  const [partners, loaded] = usePartners();
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  // Measure the first set of logos so the animation loops seamlessly
  useEffect(() => {
    if (!trackRef.current || partners.length === 0) return;
    const firstHalf = trackRef.current.querySelectorAll<HTMLElement>('[data-logo-item]');
    // Only measure the first N items (one copy of the list)
    let total = 0;
    for (let i = 0; i < partners.length && i < firstHalf.length; i++) {
      const el = firstHalf[i];
      total += el.getBoundingClientRect().width;
    }
    // Add gap width: gap-8 = 32px, gap-12 = 48px, gap-16 = 64px — use 48px average
    const gapPerItem = window.innerWidth >= 1024 ? 64 : window.innerWidth >= 640 ? 48 : 32;
    setTrackWidth(total + gapPerItem * partners.length);
  }, [partners]);

  if (loaded && partners.length === 0) return null;

  const title = locale === 'bn' ? 'শিল্প নেতাদের বিশ্বাস' : 'Trusted by Industry Leaders';

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-slate-950 border-y border-gray-100 dark:border-slate-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-industrial-dark dark:text-white uppercase tracking-tight">
            {locale === 'bn'
              ? title
              : <>Trusted by <span className="text-action-orange">Industry Leaders</span></>}
          </h2>
          <div className="w-10 h-1 bg-action-orange mx-auto mt-2 rounded-full" aria-hidden="true" />
        </div>

        <div className="relative">
          <div className="flex overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-8 sm:gap-12 lg:gap-16 py-4 items-center"
              style={trackWidth > 0 ? {
                animation: `marquee-scroll ${partners.length * 3}s linear infinite`,
                willChange: 'transform',
              } : undefined}
            >
              {[...partners, ...partners].map((partner, index) => (
                <div key={`${partner.id}-${index}`} data-logo-item="">
                  <PartnerLogo
                    name={partner.name}
                    logoUrl={partner.logoUrl}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-50%)); }
        }
      `}</style>
    </section>
  );
}
