'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useIndustries } from '@/hooks/useSiteData';
import { motion } from 'framer-motion';
import { ShoppingBag, Pill, FlaskConical, Factory, ArrowRight } from 'lucide-react';

export default function IndustriesSection() {
  const { locale } = useLocale();
  const [industries] = useIndustries();

  const iconMap: Record<string, any> = {
    'food-beverage': ShoppingBag,
    pharmaceutical: Pill,
    cosmetics: FlaskConical,
    industrial: Factory,
  };

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 dark:bg-slate-900/50 -skew-x-12 translate-x-1/2 z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-12 mb-6 sm:mb-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-1 bg-action-orange rounded-full" />
              <span className="text-action-orange font-black uppercase tracking-[0.4em] text-[10px]">
                Global Sector Expertise
              </span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-6"
            >
              Industrial <br /> <span className="text-gray-300 dark:text-slate-800">Verticals</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-500 dark:text-slate-400 font-bold text-xl md:text-2xl leading-tight uppercase tracking-tight max-w-xl"
            >
              We provide specialized machinery and technical expertise for the region's most demanding production environments.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="pb-2"
          >
            <Link href="/products" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-action-orange transition-colors touch-manipulation py-2">
              {locale === 'bn' ? 'সব ইন্ডাস্ট্রি দেখুন' : 'View All Industries'} <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((ind, index) => {
            const Icon = iconMap[ind.slug] || Factory;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              >
                <Link
                  href={`/products?category=${ind.slug}`}
                  className="group block relative p-5 sm:p-8 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:hover:shadow-action-orange/5 hover:-translate-y-2 sm:hover:-translate-y-4 transition-all duration-700 border border-gray-100 dark:border-slate-800 overflow-hidden"
                >
                  {/* Hover Background Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-action-orange/5 rounded-bl-full translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-6 sm:mb-10 group-hover:bg-action-orange group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-inner">
                      <Icon className="w-10 h-10 text-action-orange group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xl sm:text-2xl mb-3 sm:mb-6 group-hover:text-action-orange transition-colors leading-none">
                      {locale === 'bn' ? ind.nameBn : ind.nameEn}
                    </h3>
                    <div className="w-12 h-1 bg-gray-200 dark:bg-slate-800 group-hover:w-full group-hover:bg-action-orange/20 transition-all duration-700 mb-4 sm:mb-8 rounded-full" />
                    <p className="text-gray-400 dark:text-slate-500 font-medium text-sm leading-relaxed mb-6 sm:mb-10">
                      {locale === 'bn' ? (ind.descriptionBn || 'উন্নত প্রযুক্তি এবং নির্ভরযোগ্য মেশিনারি সমাধান।') : (ind.descriptionEn || 'Advanced technology and reliable machinery solutions for high-volume production.')}
                    </p>
                    <div className="flex items-center gap-3 text-action-orange font-black text-[10px] uppercase tracking-[0.3em] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
