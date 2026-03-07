'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useHeroSlides } from '@/hooks/useSiteData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSlider() {
  const { locale } = useLocale();
  const [slides] = useHeroSlides();
  const [current, setCurrent] = useState(0);
  const isBn = locale === 'bn';

  // Touch/swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goPrev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((c) => (c + 1) % slides.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Only trigger if horizontal swipe dominates (not a scroll)
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      dx < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (slides.length === 0) return null;

  return (
    <div
      className="relative h-[55vh] min-h-[380px] sm:min-h-[450px] sm:h-[65vh] md:h-[75vh] md:min-h-[500px] max-h-[900px] overflow-hidden bg-slate-950 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="relative w-full h-full">
            <Image
              src={slides[current].imageUrl || '/images/slider1.png'}
              alt={isBn ? slides[current].titleBn : slides[current].titleEn}
              fill
              className="object-cover object-center sm:scale-105"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-80" />

            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl">
                  <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <div className="flex items-center gap-2 sm:gap-6 mb-2 sm:mb-6">
                      <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-action-orange rounded-full shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
                      <span className="text-action-orange font-black uppercase tracking-[0.15em] sm:tracking-[0.4em] text-[8px] sm:text-[10px] md:text-xs">
                        {isBn ? 'শিল্প প্রকৌশল উৎকর্ষ' : 'Industrial Engineering Excellence'}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      {isBn ? (
                        <span className="block">{slides[current].titleBn}</span>
                      ) : (
                        <span className="block sm:inline">
                          {slides[current].titleEn.split(' ').map((word, i) => (
                            <span key={i} className={i % 2 === 1 ? 'text-white' : 'text-gray-400'}>
                              {word}{' '}
                            </span>
                          ))}
                        </span>
                      )}
                    </h2>

                    <div className="mt-3 sm:mt-8 flex items-start gap-3 sm:gap-8 max-w-3xl">
                      <div className="hidden sm:block w-px h-32 bg-gradient-to-b from-action-orange to-transparent mt-2" />
                      <div className="space-y-2 sm:space-y-6">
                        <p className="text-gray-300 text-xs sm:text-lg md:text-xl font-bold leading-tight uppercase tracking-tight max-w-xl">
                          {isBn
                            ? 'খাদ্য, পানীয়, কসমেটিকস এবং ফার্মাসিউটিক্যাল শিল্পের জন্য সম্পূর্ণ স্বয়ংক্রিয় প্যাকেজিং সমাধান।'
                            : 'Pioneering fully automatic packaging solutions for high-performance industrial production lines.'}
                        </p>
                        <p className="hidden sm:block text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-lg">
                          {isBn
                            ? 'আমাদের উন্নত প্রযুক্তির মেশিনারি আপনার উৎপাদন ক্ষমতা বাড়িয়ে তুলবে বহুগুণ।'
                            : 'Engineered for precision and reliability. Our world-class machinery empowers global manufacturing standards in Bangladesh.'}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-4 sm:mt-10"
                  >
                    <Link
                      href="/products"
                      className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-3 px-4 sm:px-10 py-2.5 sm:py-4 bg-action-orange text-white font-black text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] rounded-lg sm:rounded-2xl overflow-hidden transition-all shadow-2xl shadow-action-orange/40 hover:-translate-y-1 active:scale-95 touch-manipulation min-h-[40px] sm:min-h-[48px] w-fit"
                    >
                      <span className="relative z-10">
                        {isBn ? 'মেশিন দেখুন' : 'Browse Machines'}
                      </span>
                      <ArrowRight className="relative z-10 w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-action-orange opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                    {/* Request Quote — hidden on mobile, single CTA is Browse Machines */}
                    <Link
                      href="/contact"
                      className="hidden sm:inline-flex items-center justify-center px-5 sm:px-10 py-3.5 sm:py-4 bg-white/5 text-white font-black text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all backdrop-blur-3xl border border-white/10 hover:border-white/30 hover:-translate-y-1 active:scale-95 touch-manipulation min-h-[48px]"
                    >
                      {isBn ? 'কোটেশন চান' : 'Request Quote'}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators — compact on mobile */}
      <div className="absolute bottom-3 sm:bottom-10 left-0 right-0 z-30 flex justify-center items-center gap-2 sm:gap-6">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
            className="group relative flex flex-col items-center gap-1 sm:gap-2 outline-none p-2 sm:p-3 touch-manipulation"
          >
            <span className={`text-[8px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] transition-all duration-700 ${
              i === current ? 'text-action-orange scale-125' : 'text-gray-600 group-hover:text-gray-400'
            }`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className={`h-1 sm:h-1.5 transition-all duration-1000 rounded-full ${
              i === current
                ? 'w-8 sm:w-24 bg-action-orange shadow-[0_0_25px_rgba(249,115,22,1)]'
                : 'w-2 sm:w-4 bg-gray-800 group-hover:bg-gray-600'
            }`} />
          </button>
        ))}
      </div>

      {/* Swipe hint — only on mobile */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 right-3 z-30 sm:hidden flex items-center gap-1 opacity-30 pointer-events-none">
          <span className="text-white text-[8px] font-bold uppercase tracking-widest">swipe</span>
        </div>
      )}
    </div>
  );
}
