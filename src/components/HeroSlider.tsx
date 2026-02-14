'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useHeroSlides } from '@/hooks/useSiteData';

export default function HeroSlider() {
  const { locale } = useLocale();
  const [slides] = useHeroSlides();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[55vh] min-h-[360px] md:h-[70vh] overflow-hidden bg-industrial-charcoal">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.imageUrl || '/images/slider1.png'}
              alt={locale === 'bn' ? slide.titleBn : slide.titleEn}
              fill
              className="object-cover object-center"
              priority={i === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-industrial-dark/85 via-industrial-dark/50 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-12 md:pb-16">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-2xl leading-tight animate-slide-up">
                  {locale === 'bn' ? slide.titleBn : slide.titleEn}
                </h2>
                <div className="flex gap-4 mt-6">
                  <Link href="/products" className="inline-block px-6 py-3 bg-action-orange text-white font-bold rounded-lg hover:bg-action-orange-dark transition">
                    View Products
                  </Link>
                  <Link href="/contact" className="inline-block px-6 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition backdrop-blur-sm">
                    Request Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${
            i === current ? 'bg-action-orange w-8' : 'bg-white/50 w-1.5 hover:bg-white/80'
          }`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
