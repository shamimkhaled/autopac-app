'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useHeroSlides } from '@/hooks/useSiteData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSlider() {
  const { locale } = useLocale();
  const [slides] = useHeroSlides();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[65vh] min-h-[500px] md:h-[75vh] max-h-[900px] overflow-hidden bg-slate-950">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

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
              alt={locale === 'bn' ? slides[current].titleBn : slides[current].titleEn}
              fill
              className="object-cover object-center scale-105"
              priority={true}
              sizes="100vw"
            />
            
            {/* Ultra-Modern Industrial Overlays */}
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
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-16 h-1 bg-action-orange rounded-full shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
                      <span className="text-action-orange font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">
                        Industrial Engineering Excellence
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      {locale === 'bn' ? (
                        <span className="block">{slides[current].titleBn}</span>
                      ) : (
                        slides[current].titleEn.split(' ').map((word, i) => (
                          <span key={i} className={i % 2 === 1 ? 'text-white' : 'text-gray-400 block sm:inline'}>
                            {word}{' '}
                          </span>
                        ))
                      )}
                    </h2>

                    <div className="mt-8 flex items-start gap-8 max-w-3xl">
                      <div className="hidden sm:block w-px h-32 bg-gradient-to-b from-action-orange to-transparent mt-2" />
                      <div className="space-y-6">
                        <p className="text-gray-300 text-lg md:text-xl font-bold leading-tight uppercase tracking-tight max-w-xl">
                          {locale === 'bn' 
                            ? 'খাদ্য, পানীয়, কসমেটিকস এবং ফার্মাসিউটিক্যাল শিল্পের জন্য সম্পূর্ণ স্বয়ংক্রিয় প্যাকেজিং সমাধান।' 
                            : 'Pioneering fully automatic packaging solutions for high-performance industrial production lines.'}
                        </p>
                        <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-lg">
                          {locale === 'bn'
                            ? 'আমাদের উন্নত প্রযুক্তির মেশিনারি আপনার উৎপাদন ক্ষমতা বাড়িয়ে তুলবে বহুগুণ।'
                            : 'Engineered for precision and reliability. Our world-class machinery empowers global manufacturing standards in Bangladesh.'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    className="flex flex-col sm:flex-row gap-6 mt-10"
                  >
                    <Link
                      href="/products"
                      className="group relative inline-flex items-center justify-center gap-4 px-10 py-4 bg-action-orange text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl overflow-hidden transition-all shadow-2xl shadow-action-orange/40 hover:-translate-y-2 active:scale-95"
                    >
                      <span className="relative z-10">Browse Machines</span>
                      <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-action-orange opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-10 py-4 bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white/10 transition-all backdrop-blur-3xl border border-white/10 hover:border-white/30 hover:-translate-y-2 active:scale-95"
                    >
                      Request Quote
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Numerical Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center items-center gap-16">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative flex flex-col items-center gap-4 outline-none"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span className={`text-[10px] font-black tracking-[0.4em] transition-all duration-700 ${
              i === current ? 'text-action-orange scale-125' : 'text-gray-600 group-hover:text-gray-400'
            }`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className={`h-1.5 transition-all duration-1000 rounded-full ${
              i === current 
                ? 'w-24 bg-action-orange shadow-[0_0_25px_rgba(249,115,22,1)]' 
                : 'w-4 bg-gray-800 group-hover:bg-gray-600'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}
