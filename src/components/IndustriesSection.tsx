'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useIndustries } from '@/hooks/useSiteData';

export default function IndustriesSection() {
  const { locale } = useLocale();
  const [industries] = useIndustries();

  const icons: Record<string, string> = {
    'food-beverage': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    pharmaceutical: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    cosmetics: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
    industrial: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  };

  return (
    <section className="py-16 bg-industrial-light">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-industrial-dark text-center mb-12">
          Industries We Serve
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind) => (
            <Link
              key={ind.id}
              href={`/products?category=${ind.slug}`}
              className="group block p-6 bg-white rounded-xl shadow hover:shadow-lg border border-transparent hover:border-action-orange transition"
            >
              <div className="w-14 h-14 rounded-lg bg-action-orange/10 flex items-center justify-center mb-4 group-hover:bg-action-orange/20 transition">
                <svg className="w-8 h-8 text-action-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[ind.slug] || icons.industrial} />
                </svg>
              </div>
              <h3 className="font-bold text-industrial-dark group-hover:text-action-orange transition">
                {locale === 'bn' ? ind.nameBn : ind.nameEn}
              </h3>
              {ind.descriptionEn && (
                <p className="text-industrial-silver text-sm mt-2 line-clamp-2">
                  {locale === 'bn' ? ind.descriptionBn : ind.descriptionEn}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
