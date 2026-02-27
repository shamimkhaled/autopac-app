'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useHeroSlides } from '@/hooks/useSiteData';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="relative h-[60vh] min-h-[400px] md:h-[75vh] max-h-[800px] overflow-hidden bg-industrial-dark">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="relative w-full h-full">
            <Image
              src={slides[current].imageUrl || '/images/slider1.png'}
              alt={locale === 'bn' ? slides[current].titleBn : slides[current].titleEn}
              fill
              className="object-cover object-center"
              priority={true}
              sizes="100vw"
            />
            {/* Gradient Overlay for modern dark industrial look */}
            <div className="absolute inset-0 bg-gradient-to-r from-industrial-dark/95 via-industrial-dark/70 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                  >
                    <span className="inline-block px-3 py-1 bg-action-orange/20 text-action-orange font-semibold text-sm rounded-full mb-4 border border-action-orange/30">
                      AutoPac Machinery
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                      {locale === 'bn' ? slides[current].titleBn : slides[current].titleEn}
                    </h2>
                    <p className="mt-4 text-gray-300 dark:text-gray-400 text-lg sm:text-xl max-w-2xl font-light">
                      {locale === 'bn' 
                        ? 'খাদ্য, পানীয়, কসমেটিকস এবং ফার্মাসিউটিক্যাল শিল্পের জন্য সম্পূর্ণ স্বয়ংক্রিয় প্যাকেজিং সমাধান।' 
                        : 'Fully automatic packaging solutions for the food, beverage, cosmetics, and pharmaceutical industries.'}
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col xs:flex-row gap-4 mt-8"
                  >
                    <Link
                      href="/products"
                      className="inline-flex items-center justify-center px-8 py-3.5 bg-action-orange text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1"
                    >
                      Explore Products
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all backdrop-blur-md border border-white/20 hover:border-white/40 transform hover:-translate-y-1"
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

      {/* Modern Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative flex items-center justify-center h-4 px-2 focus:outline-none"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div className={`h-1.5 transition-all duration-500 rounded-full ${
              i === current ? 'w-8 bg-action-orange' : 'w-2 bg-white/40 group-hover:bg-white/70'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}
