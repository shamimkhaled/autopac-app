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
import { useProducts, useWebsiteContent } from '@/hooks/useSiteData';
import QuoteBand from '@/components/QuoteBand';
import { brochurePageSrc } from '@/data/brochure';
import { ArrowRight, BookOpen } from 'lucide-react';

const PACK_CHIPS = ['Rice', 'Atta', 'Juice', 'Soap', 'Chanachur', 'Oil', 'Biscuit', 'Honey'];

export default function HomePage() {
  const { locale } = useLocale();
  const [products] = useProducts();
  const [content] = useWebsiteContent();
  const isBn = locale === 'bn';
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const fallback = featured.length > 0 ? featured : products.slice(0, 6);
  const previewPages = [1, 6, 23, 51, 77, 88];

  return (
    <div className="bg-brand-paper dark:bg-stone-950">
      <HeroSlider />

      <section
        id="find-machinery"
        aria-label={isBn ? content.find.labelBn : content.find.labelEn}
        className="scroll-mt-24 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 whitespace-nowrap">
              {isBn ? content.find.labelBn : content.find.labelEn}
            </p>
            <div className="flex-1 max-w-2xl">
              <SiteSearch showButton inputId="home-machinery-search" />
            </div>
            <p className="text-sm text-stone-500">
              {isBn ? content.find.hintBn : content.find.hintEn}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {PACK_CHIPS.map((chip) => (
              <Link
                key={chip}
                href={`/products?q=${encodeURIComponent(chip)}`}
                className="filter-chip text-xs"
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-paper dark:bg-stone-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker={isBn ? content.lines.kickerBn : content.lines.kickerEn}
            title={isBn ? content.lines.titleBn : content.lines.titleEn}
            description={isBn ? content.lines.descriptionBn : content.lines.descriptionEn}
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

      <section className="border-y border-stone-200 dark:border-stone-800 bg-brand-maroon text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 mb-3">
              {isBn ? content.catalogBand.kickerBn : content.catalogBand.kickerEn}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              {isBn ? content.catalogBand.titleBn : content.catalogBand.titleEn}
            </h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-xl">
              {isBn ? content.catalogBand.descriptionBn : content.catalogBand.descriptionEn}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/brochure" className="btn-primary bg-white text-brand-maroon hover:bg-stone-100">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                {isBn ? content.catalogBand.ctaBn : content.catalogBand.ctaEn}
              </Link>
              <Link
                href="/contact?product=Official%20catalog"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 border border-white/40 text-white text-sm font-semibold rounded-md hover:bg-white/10"
              >
                {isBn ? 'ক্যাটালগ থেকে কোট' : 'Quote from catalog'}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {previewPages.map((page) => (
              <Link
                key={page}
                href={`/brochure?page=${page}`}
                className="relative aspect-[3/4] rounded-md overflow-hidden border border-white/20 bg-white/10 cursor-pointer"
              >
                <Image
                  src={brochurePageSrc(page)}
                  alt={`${isBn ? 'ক্যাটালগ পৃষ্ঠা' : 'Catalog page'} ${page}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 33vw, 140px"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {fallback.length > 0 && (
        <section className="section-pad border-b border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              kicker={isBn ? content.featured.kickerBn : content.featured.kickerEn}
              title={isBn ? content.featured.titleBn : content.featured.titleEn}
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

      <section className="section-pad">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="section-kicker mb-3">
                {isBn ? content.story.kickerBn : content.story.kickerEn}
              </p>
              <h2 className="page-title">
                {isBn ? content.story.titleBn : content.story.titleEn}
              </h2>
              <p className="section-lede mt-4 whitespace-pre-line">
                {isBn ? content.story.bodyBn : content.story.bodyEn}
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
                src={content.story.imageUrl || '/images/slider1.png'}
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
