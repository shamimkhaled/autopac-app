'use client';

import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import { usePartners } from '@/hooks/useSiteData';

export default function TrustedPartners() {
  const { t } = useLocale();
  const [partners] = usePartners();

  if (partners.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-industrial-dark text-center mb-12">
          {t('home.trustedBy')}
        </h2>
        <div className="relative">
          <div className="flex gap-16 items-center justify-center min-w-max partners-marquee">
            {[...partners, ...partners].map((p, i) => (
              <a
                key={`${p.id}-${i}`}
                href={p.linkUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 group"
              >
                {p.logoUrl ? (
                  <div className="relative h-12 w-32">
                    <Image src={p.logoUrl} alt={p.name} fill className="object-contain" sizes="128px" />
                  </div>
                ) : (
                  <span className="text-industrial-charcoal font-bold text-lg group-hover:text-action-orange">{p.name}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
