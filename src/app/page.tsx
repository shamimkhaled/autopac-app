'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import TrustedPartners from '@/components/TrustedPartners';
import SectionHeader from '@/components/SectionHeader';
import SiteSearch from '@/components/SiteSearch';
import ProductLineExplorer from '@/components/ProductLineExplorer';
import { useProducts, useCompany } from '@/hooks/useSiteData';
import QuoteBand from '@/components/QuoteBand';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function HomePage() {
  const { locale } = useLocale();
  const [products] = useProducts();
  const [company] = useCompany();
  const isBn = locale === 'bn';
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const fallback = featured.length > 0 ? featured : products.slice(0, 6);

  return (
    <div className="bg-brand-paper dark:bg-stone-950">
      <HeroSlider />

      <section
        id="find-machinery"
        aria-label={isBn ? 'মেশিন খুঁজুন' : 'Find a machine'}
        className="scroll-mt-24 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 whitespace-nowrap">
              {isBn ? 'মেশিন খুঁজুন' : 'Find a machine'}
            </p>
            <div className="flex-1 max-w-2xl">
              <SiteSearch showButton inputId="home-machinery-search" />
            </div>
            <p className="text-sm text-stone-500">
              {isBn ? 'নাম, অথবা যা প্যাক করেন — যেমন Rice, Juice, Soap' : 'By name, or what you pack — Rice, Juice, Soap'}
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-paper dark:bg-stone-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker={isBn ? 'পণ্য লাইন' : 'Product lines'}
            title={isBn ? 'একটি লাইন বেছে মেশিন দেখুন' : 'Choose a line. See the machines.'}
            description={
              isBn
                ? '১৬টি ক্যাটালগ লাইন। নামে ক্লিক করুন — ছবি, যা প্যাক করে, এবং কোটেশন এক জায়গায়।'
                : 'Sixteen catalog lines. Click a name — photos, what it packs, and a quote in one place.'
            }
            action={
              <div className="flex flex-wrap gap-3">
                <Link href="/brochure" className="btn-secondary">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  {isBn ? 'ক্যাটালগ' : 'Catalog'}
                </Link>
                <Link href="/products" className="btn-ghost">
                  {isBn ? 'সব মেশিন' : 'All machinery'}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            }
          />

          <ProductLineExplorer />
        </div>
      </section>

      {fallback.length > 0 && (
        <section className="section-pad border-y border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              kicker={isBn ? 'নির্বাচিত মেশিন' : 'Featured'}
              title={isBn ? 'এখন দেখার মতো মেশিন' : 'Machines factories specify first'}
              action={
                <Link href="/products" className="btn-ghost">
                  {isBn ? 'সব দেখুন' : 'View all'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {fallback.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad border-t border-stone-200 dark:border-stone-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="section-kicker mb-3">
                {isBn ? 'বিশ্বমানের মান' : 'Since 1990'}
              </p>
              <h2 className="page-title">
                {isBn
                  ? 'আমদানিকারক, প্রস্তুতকারক ও সরবরাহকারী'
                  : 'Specified for Bangladeshi factories'}
              </h2>
              <p className="section-lede mt-4">
                {isBn
                  ? 'খাদ্য, পানীয়, কসমেটিক্স, ফার্মা ও শিল্প লাইনের জন্য স্বয়ংক্রিয় মেশিনারি — ইনস্টলেশন ও যন্ত্রাংশ সহ।'
                  : (company?.taglineEn ||
                    'Importer, manufacturer, and supplier of food processing and packaging machinery — with installation and spare parts.')}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/about" className="btn-secondary">
                  {isBn ? 'আমাদের গল্প' : 'Our story'}
                </Link>
                <Link href="/gallery" className="btn-ghost">
                  {isBn ? 'মেশিন গ্যালারি' : 'Gallery'}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-stone-100 border border-stone-200 dark:border-stone-800">
              <Image
                src="/images/slider1.png"
                alt={isBn ? 'অটো প্যাক মেশিনারি' : 'Auto Pac packaging machinery'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <TrustedPartners />

      <QuoteBand />
    </div>
  );
}
