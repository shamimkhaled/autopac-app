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
import VideoShowcaseSection from '@/components/VideoShowcaseSection';
import IndustriesSection from '@/components/IndustriesSection';
import OurLegacy from '@/components/OurLegacy';
import QualityCertifications from '@/components/BusinessProfile/QualityCertifications';
import { brochurePageSrc } from '@/data/brochure';
import { ArrowRight, BookOpen, Film } from 'lucide-react';

const PACK_CHIPS = [
  { q: 'Rice', en: 'Rice', bn: 'চাল' },
  { q: 'Atta', en: 'Atta', bn: 'আটা' },
  { q: 'Juice', en: 'Juice', bn: 'জুস' },
  { q: 'Soap', en: 'Soap', bn: 'সাবান' },
  { q: 'Chanachur', en: 'Chanachur', bn: 'চানাচুর' },
  { q: 'Oil', en: 'Oil', bn: 'তেল' },
  { q: 'Biscuit', en: 'Biscuit', bn: 'বিস্কুট' },
  { q: 'Honey', en: 'Honey', bn: 'মধু' },
] as const;

export default function HomePage() {
  const { locale } = useLocale();
  const [products] = useProducts();
  const [content] = useWebsiteContent();
  const isBn = locale === 'bn';
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const fallback = featured.length > 0 ? featured : products.slice(0, 6);
  const previewPages = [2, 6, 7, 8, 9, 23];

  const sections = content.sections;

  return (
    <div className="bg-brand-paper dark:bg-stone-950">
      <HeroSlider showStats={sections?.showHeroStats !== false} />

      {/* Streamlined Fast Machine Finder Strip */}
      {sections?.showFindBar !== false && (
        <section
          id="find-machinery"
          aria-label={isBn ? content.find.labelBn : content.find.labelEn}
          className="scroll-mt-24 bg-[var(--surface)] dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink whitespace-nowrap">
                {isBn ? content.find.labelBn : content.find.labelEn}
              </p>
              <div className="flex-1 max-w-2xl">
                <SiteSearch showButton inputId="home-machinery-search" />
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="text-stone-400 dark:text-stone-500">
                  {isBn ? 'দ্রুত ফিল্টার:' : 'Quick lines:'}
                </span>
                {PACK_CHIPS.map((chip) => (
                  <Link
                    key={chip.q}
                    href={`/products?q=${encodeURIComponent(chip.q)}`}
                    className="font-medium text-stone-600 dark:text-stone-300 hover:text-brand-ink transition-colors py-0.5"
                  >
                    {isBn ? chip.bn : chip.en}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 16 Machinery Catalog Lines Interactive Explorer */}
      {sections?.showProductLines !== false && (
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
      )}

      {/* Featured Machines */}
      {sections?.showFeaturedMachines !== false && fallback.length > 0 && (
        <section className="section-pad border-y border-stone-200 dark:border-stone-800 bg-[var(--surface)] dark:bg-stone-950">
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

      {/* Machinery Video Showcase & Operation Walkthrough */}
      {sections?.showVideoShowcase !== false && (
        <section
          id="video-showcase"
          className="section-pad border-b border-stone-200 dark:border-stone-800 bg-brand-paper dark:bg-stone-950 scroll-mt-20"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              kicker={isBn ? 'অপারেশন ভিডিও ও প্রসেস' : 'Machinery video showcase'}
              title={isBn ? 'মেশিন চালানোর ধাপ ও কাজের প্রক্রিয়া দেখুন' : 'See how Auto Pac lines operate'}
              description={
                isBn
                  ? 'ফিডিং, ডোজিং, সিলিং ও সিআইপি প্রসেস ধাপে ধাপে দেখুন — সরাসরি ক্যাটালগ শিট ও কোটেশন লিংকসহ।'
                  : 'Step-by-step visual walkthroughs from hopper feeding to sealing, bottling, and CIP cleaning.'
              }
              action={
                <Link href="/gallery?tab=videos" className="btn-secondary whitespace-nowrap">
                  <Film className="w-4 h-4" aria-hidden="true" />
                  {isBn ? 'পূর্ণ ভিডিও গ্যালারি' : 'Full video showcase'}
                </Link>
              }
            />
            <VideoShowcaseSection compact />
          </div>
        </section>
      )}

      {/* Official 122-Page Sales Catalog Preview (Architectural Dark Slate Anchor) */}
      {sections?.showCatalogBand !== false && (
        <section className="border-b border-stone-800 bg-stone-950 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8849A] mb-3">
                {isBn ? content.catalogBand.kickerBn : content.catalogBand.kickerEn}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white [text-wrap:balance]">
                {isBn ? content.catalogBand.titleBn : content.catalogBand.titleEn}
              </h2>
              <p className="mt-3 text-stone-300 leading-relaxed max-w-xl">
                {isBn ? content.catalogBand.descriptionBn : content.catalogBand.descriptionEn}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/brochure" className="btn-primary whitespace-nowrap shrink-0">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  {isBn ? content.catalogBand.ctaBn : content.catalogBand.ctaEn}
                </Link>
                <Link
                  href="/contact?product=Official%20catalog"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 border border-stone-700 text-stone-100 text-sm font-semibold rounded-md hover:border-stone-500 hover:bg-stone-900 transition-colors whitespace-nowrap shrink-0"
                >
                  {isBn ? 'ক্যাটালগ থেকে কোট' : 'Quote from catalog'}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {previewPages.map((page) => (
                <Link
                  key={page}
                  href={`/brochure?page=${page}`}
                  className="relative aspect-[3/4] rounded-md overflow-hidden border border-stone-800 bg-white hover:border-[#E8849A] transition-colors cursor-pointer"
                >
                  <Image
                    src={brochurePageSrc(page)}
                    alt={`${isBn ? 'ক্যাটালগ পৃষ্ঠা' : 'Catalog page'} ${page}`}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 1024px) 33vw, 150px"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hidden by default per user request — configurable in Admin -> Website copy */}
      {sections?.showIndustries === true && <IndustriesSection />}

      {/* Company Story */}
      {sections?.showStory !== false && (
        <section className="section-pad bg-brand-paper dark:bg-stone-950">
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
              <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-white border border-stone-200 dark:border-stone-800">
                <Image
                  src={content.story.imageUrl || '/machines/screw-auger-plc-packer.webp'}
                  alt={isBn ? 'অটো প্যাক মেশিনারি' : 'Auto Pac packaging machinery'}
                  fill
                  className="object-contain p-5"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hidden by default per user request — configurable in Admin -> Website copy */}
      {sections?.showCertifications === true && (
        <section className="section-pad bg-brand-paper dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <QualityCertifications />
          </div>
        </section>
      )}

      {/* Hidden by default per user request — configurable in Admin -> Website copy */}
      {sections?.showLegacyStats === true && <OurLegacy />}

      {sections?.showPartners !== false && <TrustedPartners />}

      {sections?.showQuoteBand !== false && <QuoteBand />}
    </div>
  );
}
