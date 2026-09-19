'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useHeroSlides } from '@/hooks/useSiteData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider() {
  const { locale } = useLocale();
  const [slides] = useHeroSlides();
  const [current, setCurrent] = useState(0);
  const isBn = locale === 'bn';
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const slidesOrFallback =
    slides.length > 0
      ? slides
      : [
          {
            id: 'fallback',
            imageUrl: '/images/slider1.png',
            titleEn: '',
            titleBn: '',
          },
        ];
  const count = slidesOrFallback.length;

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % count), 7000);
    return () => clearInterval(timer);
  }, [count]);

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

  const stats = [
    { value: '35+', label: isBn ? 'বছর ঢাকায়' : 'Years in Dhaka' },
    { value: '500+', label: isBn ? 'মেশিন সরবরাহ' : 'Machines delivered' },
    { value: '300+', label: isBn ? 'কারখানা' : 'Factory clients' },
    { value: '16', label: isBn ? 'পণ্য লাইন' : 'Product lines' },
  ];

  return (
    <section
      className="relative min-h-[480px] h-[min(72vh,640px)] overflow-hidden bg-stone-950"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label={isBn ? 'মেশিনারি হাইলাইট' : 'Machinery highlights'}
    >
      {slidesOrFallback.map((item, i) => (
        <div
          key={item.id || i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== current}
        >
          <Image
            src={item.imageUrl || '/images/slider1.png'}
            alt={
              (isBn ? item.titleBn : item.titleEn) ||
              (isBn ? 'অটো প্যাক মেশিনারি' : 'Auto Pac packaging machinery')
            }
            fill
            className="object-cover object-[70%_center]"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark only behind copy so the machine stays visible on the right */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[68%] bg-gradient-to-r from-stone-950/80 via-stone-950/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-950/70 to-transparent" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex items-center pb-24 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl border-l-[3px] border-brand-maroon pl-5 sm:pl-7">
              <p className="text-sm sm:text-base font-medium text-white">
                {isBn ? 'অটো প্যাক · ১৯৯০ থেকে · কাওরান বাজার, ঢাকা' : 'Auto Pac · Since 1990 · Kawran Bazar, Dhaka'}
              </p>
              <h1 className="mt-3 font-display text-[1.85rem] sm:text-5xl lg:text-[3.15rem] font-semibold tracking-tight text-white leading-[1.2] [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
                {isBn
                  ? 'আপনার কারখানার জন্য প্রক্রিয়াকরণ ও প্যাকিং মেশিন'
                  : 'Processing and packing machines for your factory'}
              </h1>
              <p className="mt-4 text-base sm:text-xl text-white leading-relaxed max-w-xl [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
                {isBn
                  ? '১৬টি পণ্য লাইন দেখুন। যে মেশিন দরকার, তার কোটেশন চান।'
                  : 'Browse 16 product lines. Request a quote for the machine you need.'}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="#find-machinery" className="btn-primary bg-white text-brand-maroon hover:bg-stone-100">
                  {isBn ? 'মেশিন খুঁজুন' : 'Find a machine'}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 border-2 border-white text-white text-sm font-semibold rounded-md hover:bg-white/15 transition-colors"
                >
                  {isBn ? 'কোটেশন চান' : 'Request a quote'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 bg-stone-950/55">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3.5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="text-white">
                <div className="font-display text-xl sm:text-2xl font-semibold tracking-tight">{s.value}</div>
                <div className="text-sm text-white/90 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-md border border-white/25 bg-stone-950/40 text-white hover:bg-stone-950/70"
            aria-label={isBn ? 'আগের স্লাইড' : 'Previous slide'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-md border border-white/25 bg-stone-950/40 text-white hover:bg-stone-950/70"
            aria-label={isBn ? 'পরের স্লাইড' : 'Next slide'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex absolute bottom-[4.75rem] left-0 right-0 z-20 justify-center gap-2">
            {slidesOrFallback.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`${isBn ? 'স্লাইড' : 'Slide'} ${i + 1}`}
                aria-current={i === current ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === current ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
