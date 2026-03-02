'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import HeroSlider from '@/components/HeroSlider';
import ProductCategory from '@/components/ProductCategory';
import TrustedPartners from '@/components/TrustedPartners';
import IndustriesSection from '@/components/IndustriesSection';
import OurLegacy from '@/components/OurLegacy';
import { useProducts, useCategories, useCompany } from '@/hooks/useSiteData';
import type { Product, Category } from '@/lib/api';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { t, locale } = useLocale();
  const [products] = useProducts();
  const [categories] = useCategories();
  const [company] = useCompany();

  const whatsapp = company?.whatsapp || '8801818496642';

  const stats = [
    { label: 'Machines Delivered', value: '500+', icon: Zap },
    { label: 'Global Partners', value: '25+', icon: Award },
    { label: 'Happy Clients', value: '300+', icon: CheckCircle2 },
    { label: 'Years Experience', value: '15+', icon: ShieldCheck },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <HeroSlider />

      {/* Intro Section - Premium Industrial Aesthetic */}
      <section className="py-6 sm:py-10 bg-gray-50 dark:bg-slate-900/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-action-orange to-transparent opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-1 bg-action-orange rounded-full" />
                <span className="text-action-orange font-black uppercase tracking-[0.4em] text-[10px]">
                  Uncompromising Standards
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-4">
                World-Class <br /> <span className="text-gray-300 dark:text-slate-800">Machinery</span> Solutions
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-base lg:text-lg font-medium leading-relaxed mb-6 max-w-xl">
                {locale === 'bn' 
                  ? 'আমরা বাংলাদেশের শীর্ষস্থানীয় খাদ্য ও পানীয়, কসমেটিকস এবং ফার্মাসিউটিক্যাল শিল্পের জন্য উন্নত মানের স্বয়ংক্রিয় মেশিনারি সরবরাহকারী।'
                  : 'We are the premier importer and manufacturer of high-performance automated systems, driving industrial efficiency across Bangladesh.'}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {stats.map((stat, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="text-2xl lg:text-3xl font-black text-action-orange tracking-tighter">{stat.value}</div>
                    <div className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="group inline-flex items-center gap-4 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-action-orange transition-all shadow-xl hover:-translate-y-2 active:scale-95"
              >
                Our Legacy <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="relative aspect-[2/1] lg:aspect-[4/3] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent z-10" />
              <Image
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070"
                alt="Industrial Machinery"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-20">
                <div className="p-3 sm:p-5 bg-white/10 backdrop-blur-3xl rounded-[16px] sm:rounded-[24px] border border-white/20 shadow-2xl">
                  <div className="text-action-orange text-2xl sm:text-3xl font-black mb-0.5 tracking-tighter">15+</div>
                  <div className="text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em]">Years of Trust</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Categories - Modern Grid */}
      <section className="py-10 sm:py-14 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-action-orange font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">Engineered Solutions</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Precision <span className="text-gray-300 dark:text-slate-800">Catalogue</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat: { id: string; slug: string; nameEn: string; nameBn: string; descriptionEn?: string; descriptionBn?: string }, index: number) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group block p-10 bg-gray-50 dark:bg-slate-900/50 rounded-[32px] border border-transparent hover:border-action-orange/20 hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 hover:shadow-2xl hover:shadow-action-orange/5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-10 group-hover:bg-action-orange transition-all duration-500 shadow-sm group-hover:shadow-action-orange/20">
                    <svg className="w-8 h-8 text-action-orange group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white mb-4 text-xl uppercase tracking-tight leading-none">
                    {locale === 'bn' ? cat.nameBn : cat.nameEn}
                  </h3>
                  <p className="text-gray-500 dark:text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed mb-8">
                    {locale === 'bn' ? cat.descriptionBn : cat.descriptionEn}
                  </p>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-action-orange opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    Explore Product Range
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <IndustriesSection />

      <TrustedPartners />

      {/* Dynamic Product Categories - Refined Design */}
      <div className="bg-gray-50 dark:bg-slate-950/50 py-10 sm:py-14 border-y border-gray-100 dark:border-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <span className="text-action-orange font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">Product Showcase</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Featured <span className="text-gray-300 dark:text-slate-800">Technological</span> Excellence
          </h2>
        </div>
        {categories.map((category: Category) => {
          const categoryProducts = products.filter((p: Product) => p.categoryId === category.id);
          if (categoryProducts.length === 0) return null;
          
          return (
            <ProductCategory
              key={category.id}
              category={category}
              products={categoryProducts}
            />
          );
        })}
      </div>

      {/* CTA Banner - Ultra Modern Industrial */}
      <section className="py-16 md:py-20 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        {/* Decorative elements for industrial feel */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-action-orange/20 blur-[160px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 uppercase tracking-tighter leading-tight">
              {locale === 'bn' 
                ? 'অটো প্যাক মানে, হাতের ছোঁয়া ছাড়াই স্বয়ংক্রিয় ভাবে প্যাক করা' 
                : <><span>Advanced Industrial</span> <br /> <span>Automation Starts Here</span></>}
            </h2>
            <p className="text-gray-400 font-bold mb-16 max-w-2xl mx-auto text-xl uppercase tracking-tight">
              {locale === 'bn'
                ? 'আপনার মেশিনারির কোটেশন পেতে আজই আমাদের সাথে যোগাযোগ করুন।'
                : 'Optimize your production line with world-class engineering. Request your custom machinery quotation today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center bg-action-orange text-white font-black py-6 px-12 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-2xl shadow-action-orange/30 hover:-translate-y-2 active:scale-95"
              >
                Request Quote <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-3 transition-transform duration-500" />
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-4 bg-white/5 text-white font-black py-6 px-12 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-3xl border border-white/10 hover:-translate-y-2 active:scale-95"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <OurLegacy />
    </div>
  );
}
