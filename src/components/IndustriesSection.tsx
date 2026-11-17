'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useIndustries } from '@/hooks/useSiteData';
import { ShoppingBag, Pill, FlaskConical, Factory, ArrowRight } from 'lucide-react';

export default function IndustriesSection() {
  const { locale } = useLocale();
  const [industries] = useIndustries();
  const isBn = locale === 'bn';

  const iconMap: Record<string, React.ElementType> = {
    'food-beverage': ShoppingBag,
    pharmaceutical: Pill,
    cosmetics: FlaskConical,
    industrial: Factory,
  };

  return (
    <section className="section-pad bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="section-kicker mb-2">
              {isBn ? 'শিল্পখাত সমূহ' : 'Sectors served'}
            </p>
            <h2 className="page-title">
              {isBn ? 'প্রতিটি শিল্প খাতের জন্য বিশেষায়িত মেশিন' : 'Industrial verticals we equip'}
            </h2>
            <p className="section-lede mt-3">
              {isBn
                ? 'খাদ্য, পানীয়, ফার্মা, কসমেটিক্স ও রাসায়নিক উৎপাদন লাইনের জন্য স্বয়ংক্রিয় সমাধান।'
                : 'Engineered processing and packaging systems calibrated for high-uptime Bangladeshi and export production.'}
            </p>
          </div>
          <Link href="/products" className="btn-ghost whitespace-nowrap shrink-0">
            {isBn ? 'সব ইন্ডাস্ট্রি দেখুন' : 'View all machinery'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((ind) => {
            const Icon = iconMap[ind.slug] || Factory;
            return (
              <Link
                key={ind.id}
                href={`/products?category=${ind.slug}`}
                className="surface-card surface-card-hover p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-11 h-11 rounded-md bg-brand-paper dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center mb-5 group-hover:bg-brand-maroon group-hover:border-brand-maroon transition-colors">
                    <Icon className="w-5 h-5 text-brand-maroon group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-white group-hover:text-brand-maroon transition-colors">
                    {isBn ? ind.nameBn : ind.nameEn}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {isBn
                      ? ind.descriptionBn || 'উন্নত প্রযুক্তি এবং নির্ভরযোগ্য মেশিনারি সমাধান।'
                      : ind.descriptionEn ||
                        'Food-grade stainless machinery and reliable local spare-parts support.'}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-maroon">
                  {isBn ? 'মেশিন দেখুন' : 'Explore line'}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
