'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useHeroSlides, useWebsiteContent, useSiteStats } from '@/hooks/useSiteData';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

export default function HeroSlider({ showStats = true }: { showStats?: boolean }) {
  const { locale } = useLocale();
  const [slides] = useHeroSlides();
  const [content] = useWebsiteContent();
  const [stats] = useSiteStats();
  const [current, setCurrent] = useState(0);
  const isBn = locale === 'bn';
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const hero = content.hero;

  const slidesOrFallback =
    slides.length > 0
      ? slides
      : [
          {
            id: '1',
            imageUrl: '/images/slider1.png',
            titleEn: 'Food & Granule Processing Lines',
            titleBn: 'খাদ্য ও গ্রানুল প্রক্রিয়াকরণ লাইন',
          },
          {
            id: '2',
            imageUrl: '/images/slider2.png',
            titleEn: 'Cosmetics, Unani & Detergent Packing',
            titleBn: 'কসমেটিক্স, ইউনানী ও ডিটারজেন্ট প্যাকিং',
          },
          {
            id: '3',
            imageUrl: '/images/slider3.png',
            titleEn: 'Water Treatment & Filling Plants',
            titleBn: 'ওয়াটার ট্রিটমেন্ট ও ফিলিং প্ল্যান্ট',
          },
        ];

  const count = slidesOrFallback.length;
  const safeIdx = current % count;
  const displayStats = stats.slice(0, 4);

  const goPrev = () => setCurrent((c) => (c - 1 + count) % count);
  const goNext = () => setCurrent((c) => (c + 1) % count);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      dx < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      className="bg-brand-paper dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800"
      aria-label={isBn ? 'অটো প্যাক মেশিনারি পরিচিতি' : 'Auto Pac Machinery Hero'}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-8 sm:pt-10 sm:pb-12 space-y-6 sm:space-y-8">
        {/* Top Editorial Proposition & Primary Conversion Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
          <div className="lg:col-span-7">
            <p className="section-kicker">
              {isBn ? hero.eyebrowBn : hero.eyebrowEn}
            </p>
            <h1 className="mt-2.5 font-display text-[2.2rem] sm:text-[3rem] lg:text-[3.5rem] font-semibold tracking-tight text-stone-900 dark:text-white leading-[1.06] [text-wrap:balance]">
              {isBn ? hero.titleBn : hero.titleEn}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
              {isBn ? hero.ledeBn : hero.ledeEn}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col lg:items-end justify-end gap-3.5">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto lg:justify-end">
              <Link href="/contact" className="btn-primary whitespace-nowrap shrink-0">
                {isBn ? hero.ctaQuoteBn : hero.ctaQuoteEn}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/brochure" className="btn-secondary whitespace-nowrap shrink-0">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                {isBn ? '১২২-পৃষ্ঠার ক্যাটালগ' : '122-Page Catalog'}
              </Link>
            </div>
            <p className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
              <ShieldCheck className="w-4 h-4 text-brand-maroon shrink-0" aria-hidden="true" />
              <span>
                {isBn
                  ? 'এসএস-৩০৪ ফুড-গ্রেড · ঢাকায় ইনস্টলেশন ও স্পেয়ার পার্টস'
                  : 'SS-304 Food-Grade · Dhaka Commissioning & Spare Parts'}
              </span>
            </p>
          </div>
        </div>

        {/* Pure Unobstructed Image Slider (Zero Text Overlaid on Images) */}
        <div
          className="surface-card overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-roledescription="carousel"
          aria-label={isBn ? 'মেশিনারি ছবি স্লাইডার' : 'Machinery image slideshow'}
        >
          {/* Clean Image Viewport — No Scrims, No Text Overlays */}
          <div className="relative w-full aspect-[16/6] sm:aspect-[16/5] min-h-[160px] sm:min-h-[260px] lg:min-h-[340px] bg-white overflow-hidden">
            {slidesOrFallback.map((item, i) => (
              <div
                key={item.id || i}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  i === safeIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={i !== safeIdx}
              >
                <Image
                  src={item.imageUrl || '/images/slider1.png'}
                  alt={
                    (isBn ? item.titleBn : item.titleEn) ||
                    (isBn ? 'অটো প্যাক মেশিনারি' : 'Auto Pac machinery')
                  }
                  fill
                  className="object-contain p-1 sm:p-2"
                  priority={i === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            ))}
          </div>

          {/* User-Friendly Focus Controls Strip Below the Image */}
          <div className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 px-3 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Thumbnail Focus Tabs */}
            <div
              role="tablist"
              aria-label={isBn ? 'স্লাইড নির্বাচন করুন' : 'Select hero slide'}
              className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
            >
              {slidesOrFallback.map((slide, idx) => {
                const isSelected = idx === safeIdx;
                const label =
                  (isBn ? slide.titleBn : slide.titleEn) ||
                  (isBn ? `স্লাইড ${idx + 1}` : `Showcase ${idx + 1}`);
                return (
                  <button
                    key={slide.id || idx}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setCurrent(idx)}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border text-left transition-colors cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-brand-maroon text-white border-brand-maroon'
                        : 'bg-brand-paper/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-brand-maroon hover:text-brand-maroon dark:hover:text-white'
                    }`}
                  >
                    <div className="relative w-12 h-7 rounded-sm overflow-hidden bg-white border border-stone-200 dark:border-stone-700 shrink-0">
                      <Image
                        src={slide.imageUrl || '/images/slider1.png'}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <span className="text-xs font-semibold whitespace-nowrap max-w-[170px] truncate">
                      {String(idx + 1).padStart(2, '0')} · {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Step Prev / Counter / Next Controls */}
            {count > 1 && (
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 tabular-nums mr-1">
                  {String(safeIdx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label={isBn ? 'আগের স্লাইড' : 'Previous slide'}
                    className="w-10 h-10 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 hover:border-brand-maroon hover:text-brand-maroon flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label={isBn ? 'পরের স্লাইড' : 'Next slide'}
                    className="w-10 h-10 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 hover:border-brand-maroon hover:text-brand-maroon flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verified 4-Column Track Record Bar */}
        {showStats && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800">
            {displayStats.map((s) => (
              <div key={s.id} className="px-5 py-4">
                <div className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-white tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                  {isBn ? s.labelBn : s.labelEn}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
