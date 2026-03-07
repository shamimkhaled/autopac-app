'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import HeroSlider from '@/components/HeroSlider';
import ProductCategory from '@/components/ProductCategory';
import TrustedPartners from '@/components/TrustedPartners';
import IndustriesSection from '@/components/IndustriesSection';
import { useProducts, useCategories, useCompany } from '@/hooks/useSiteData';
import type { Product, Category } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Award, Zap, ShieldCheck, ArrowRight,
  Factory, Package, Wrench, Droplets, GlassWater, UtensilsCrossed,
  Cookie, Leaf, Fuel, Wind, Box, Settings, Globe,
} from 'lucide-react';

// Product type catalogue — directly from the Auto Pac business profile (HTML)
const CATALOGUE = [
  {
    icon: Droplets,
    en: 'Water Treatment Plant',
    bn: 'ওয়াটার ট্রিটমেন্ট প্ল্যান্ট',
    descEn: 'Fully automatic mineral water purification and treatment plant systems for industrial-scale clean water production.',
    descBn: 'শিল্পমাত্রার বিশুদ্ধ পানি উৎপাদনের জন্য সম্পূর্ণ স্বয়ংক্রিয় ওয়াটার ট্রিটমেন্ট প্ল্যান্ট।',
    color: 'blue',
    slug: 'water-treatment',
  },
  {
    icon: GlassWater,
    en: 'Juice & Drinks Plant',
    bn: 'জুস ও ড্রিংকস প্ল্যান্ট',
    descEn: 'Complete automatic juice, carbonated drink, and beverage processing and bottling plant solutions.',
    descBn: 'সম্পূর্ণ স্বয়ংক্রিয় জুস, কার্বোনেটেড ড্রিংক ও পানীয় প্রক্রিয়াকরণ ও বোতলজাতকরণ প্ল্যান্ট।',
    color: 'orange',
    slug: 'juice-drinks',
  },
  {
    icon: UtensilsCrossed,
    en: 'Stick & Instant Noodles Plant',
    bn: 'স্টিক ও ইন্সট্যান্ট নুডলস প্ল্যান্ট',
    descEn: 'High-speed automatic stick noodles and instant noodles processing and packaging production lines.',
    descBn: 'উচ্চ-গতির স্বয়ংক্রিয় স্টিক নুডলস ও ইন্সট্যান্ট নুডলস প্রক্রিয়াকরণ ও প্যাকেজিং লাইন।',
    color: 'yellow',
    slug: 'noodles',
  },
  {
    icon: Cookie,
    en: 'Chanachur, Biscuit, Mango Bar & Chocolate Plant',
    bn: 'চানাচুর, বিস্কুট, ম্যাঙ্গো বার ও চকোলেট প্ল্যান্ট',
    descEn: 'Automated processing and packing machinery for chanachur, biscuits, mango bars, cadbury chocolate, and snack foods.',
    descBn: 'চানাচুর, বিস্কুট, ম্যাঙ্গো বার, ক্যাডবেরি চকোলেট ও স্ন্যাক ফুডের স্বয়ংক্রিয় প্রক্রিয়াকরণ মেশিন।',
    color: 'amber',
    slug: 'biscuit-chocolate',
  },
  {
    icon: Leaf,
    en: 'Mango, Orange, Tomato & Pulp Processing Plant',
    bn: 'আম, কমলা, টমেটো ও পাল্প প্রক্রিয়াকরণ প্ল্যান্ট',
    descEn: 'Industrial fruit pulp extraction, pasteurisation, and packaging plant for mango, orange, tomato, and other fruits.',
    descBn: 'আম, কমলা, টমেটো ও অন্যান্য ফলের শিল্পমাত্রার পাল্প নিষ্কাশন, পাস্তুরাইজেশন ও প্যাকেজিং প্ল্যান্ট।',
    color: 'green',
    slug: 'fruit-pulp',
  },
  {
    icon: Fuel,
    en: 'Mustard Oil Expeller, Ghee & Soybean Oil Machineries',
    bn: 'সরিষার তেল এক্সপেলার, ঘি ও সয়াবিন তেল মেশিনারি',
    descEn: 'Auto and semi-auto oil expeller, ghee processing, and soybean oil extraction machinery for edible oil production.',
    descBn: 'স্বয়ংক্রিয় ও আধা-স্বয়ংক্রিয় তেল এক্সপেলার, ঘি প্রক্রিয়াকরণ ও সয়াবিন তেল নিষ্কাশন মেশিনারি।',
    color: 'olive',
    slug: 'oil-expeller',
  },
  {
    icon: Wind,
    en: 'Mosquito Coil Machine Plant',
    bn: 'মশার কয়েল মেশিন প্ল্যান্ট',
    descEn: 'Complete automatic mosquito coil processing, pressing, drying, and packaging machinery plant.',
    descBn: 'সম্পূর্ণ স্বয়ংক্রিয় মশার কয়েল প্রক্রিয়াকরণ, চাপ, শুকানো ও প্যাকেজিং মেশিনারি প্ল্যান্ট।',
    color: 'teal',
    slug: 'mosquito-coil',
  },
  {
    icon: Box,
    en: 'Bottle Injection & Blow Moulding Plant',
    bn: 'বোতল ইনজেকশন ও ব্লো মোল্ডিং প্ল্যান্ট',
    descEn: 'Industrial-grade injection moulding and blow moulding machinery for plastic bottle and container manufacturing.',
    descBn: 'প্লাস্টিক বোতল ও কন্টেইনার উৎপাদনের জন্য শিল্পমাত্রার ইনজেকশন মোল্ডিং ও ব্লো মোল্ডিং মেশিনারি।',
    color: 'indigo',
    slug: 'blow-moulding',
  },
  {
    icon: Settings,
    en: 'Auto & Semi-Auto Processing & Packaging — Food, Cosmetics, Pharma, Ayurvedic, Unani',
    bn: 'স্বয়ংক্রিয় ও আধা-স্বয়ংক্রিয় প্রক্রিয়াকরণ ও প্যাকেজিং — খাদ্য, কসমেটিক্স, ফার্মা, আয়ুর্বেদিক, ইউনানি',
    descEn: 'Full range of automatic and semi-automatic processing and packaging machinery for food items, cosmetics, ayurvedic, unani, and pharmaceutical products.',
    descBn: 'খাদ্য, কসমেটিক্স, আয়ুর্বেদিক, ইউনানি ও ফার্মাসিউটিক্যাল পণ্যের জন্য স্বয়ংক্রিয় ও আধা-স্বয়ংক্রিয় প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারির সম্পূর্ণ পরিসর।',
    color: 'purple',
    slug: 'products',
  },
  {
    icon: Globe,
    en: 'Importer, Manufacturer, Supplier & Servicing',
    bn: 'আমদানিকারক, প্রস্তুতকারক, সরবরাহকারী ও সার্ভিসিং',
    descEn: 'End-to-end partner for all your machinery needs — import, local manufacturing, supply, installation, and after-sales service.',
    descBn: 'আপনার সমস্ত মেশিনারির প্রয়োজনে সম্পূর্ণ অংশীদার — আমদানি, স্থানীয় উৎপাদন, সরবরাহ, ইনস্টলেশন ও বিক্রয়-পরবর্তী সার্ভিস।',
    color: 'rose',
    slug: 'contact',
  },
] as const;

// 40+ products from the original Auto Pac business profile (HTML) — scrolling ticker
const PROCESSABLE = [
  'Atta', 'Maida', 'Rice', 'Dal', 'Sugar', 'Salt', 'Biscuit', 'Potato Chips',
  'Chanachur', 'Tea', 'Coffee', 'Peanut', 'Candy', 'Milk Powder', 'Spices',
  'Instant Noodles', 'Mango Bar', 'Chocolate Bar', 'Snacks', 'Cake',
  'Mineral Water', 'Mango Juice', 'Orange Juice', 'Carbonated Drinks',
  'Tomato Sauce', 'Jam', 'Jelly', 'Honey', 'Milk', 'Mustard Oil', 'Soyabean Oil',
  'Mosquito Coil', 'Washing Powder', 'Soap', 'Shampoo', 'Talcum Powder',
  'Shaving Cream', 'Fairness Cream', 'Pharmaceuticals', 'Ghee', 'Dry Fruits',
];

export default function HomePage() {
  const { locale } = useLocale();
  const [products] = useProducts();
  const [categories] = useCategories();
  const [company] = useCompany();

  const whatsapp = company?.whatsapp || '8801818496642';
  const isBn = locale === 'bn';

  const stats = [
    { label: isBn ? 'মেশিন সরবরাহ' : 'Machines Delivered', value: '500+', icon: Zap },
    { label: isBn ? 'গ্লোবাল পার্টনার' : 'Global Partners',    value: '25+',  icon: Award },
    { label: isBn ? 'সন্তুষ্ট ক্লায়েন্ট' : 'Happy Clients',  value: '300+', icon: CheckCircle2 },
    { label: isBn ? 'বছরের অভিজ্ঞতা' : 'Years Experience',    value: '35+',  icon: ShieldCheck },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <HeroSlider />

      {/* Trust Strip — Company Credentials (Est. 1990) */}
      <div className="bg-industrial-dark border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-4 py-2.5 sm:py-2.5">
            {([
              { icon: Factory,      en: 'Est. 1990 — Kawran Bazar, Dhaka',          bn: 'প্রতিষ্ঠিত ১৯৯০ — কাওরান বাজার, ঢাকা' },
              { icon: Package,      en: 'Importer · Manufacturer · Supplier',        bn: 'আমদানিকারক · প্রস্তুতকারক · সরবরাহকারী' },
              { icon: Wrench,       en: 'After-Sales Service & Spare Parts',         bn: 'বিক্রয়-পরবর্তী সার্ভিস ও যন্ত্রাংশ' },
              { icon: CheckCircle2, en: '300+ Happy Clients Across Bangladesh',       bn: 'বাংলাদেশে ৩০০+ সন্তুষ্ট ক্লায়েন্ট' },
            ] as const).map(({ icon: Icon, en, bn }, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-white/50 hover:text-white/80 transition-colors">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-action-orange flex-shrink-0" />
                <span className="text-[10px] sm:text-[10px] font-bold uppercase tracking-wider">
                  {isBn ? bn : en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intro Section - Premium Industrial Aesthetic */}
      <section className="py-5 sm:py-10 bg-gray-50 dark:bg-slate-900/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-action-orange to-transparent opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-action-orange rounded-full" />
                <span className="text-action-orange font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[9px] sm:text-[10px]">
                  {isBn ? 'বিশ্বমানের মান' : 'World-Class Standards'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-3 sm:mb-4">
                {isBn ? (
                  <>বিশ্বমানের <br /><span className="text-gray-300 dark:text-slate-800">মেশিনারি</span> সমাধান</>
                ) : (
                  <>World-Class <br /><span className="text-gray-300 dark:text-slate-800">Machinery</span> Solutions</>
                )}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg font-medium leading-relaxed mb-4 sm:mb-6 max-w-xl">
                {isBn
                  ? 'আমরা ১৯৯০ সাল থেকে বাংলাদেশের খাদ্য ও পানীয়, কসমেটিকস, ফার্মাসিউটিক্যাল এবং শিল্প খাতের জন্য বিশ্বমানের স্বয়ংক্রিয় মেশিনারির আমদানিকারক, প্রস্তুতকারক ও সরবরাহকারী।'
                  : (company?.taglineEn || 'Since 1990, Auto Pac has been the premier importer, manufacturer & supplier of world-class food processing and packaging machinery — serving 300+ clients across Bangladesh.')}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {stats.map((stat, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="text-lg sm:text-xl lg:text-3xl font-black text-action-orange tracking-tighter">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 dark:text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href="/about"
                  className="group inline-flex items-center justify-center gap-1.5 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 min-h-[40px] sm:min-h-[48px] bg-slate-900 dark:bg-slate-800 text-white font-black text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] rounded-lg sm:rounded-xl hover:bg-action-orange transition-all shadow-xl hover:-translate-y-1 active:scale-95 touch-manipulation"
                >
                  {isBn ? 'আমাদের গল্প' : 'Our Story'} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform duration-500" />
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 min-h-[40px] sm:min-h-[48px] bg-action-orange/10 text-action-orange font-black text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] rounded-lg sm:rounded-xl hover:bg-action-orange hover:text-white transition-all border border-action-orange/30 active:scale-95 touch-manipulation"
                >
                  {isBn ? 'মেশিন গ্যালারি' : 'View Gallery'}
                </Link>
              </div>
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
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-20">
                <div className="p-3 sm:p-5 bg-white/10 backdrop-blur-3xl rounded-[16px] sm:rounded-[24px] border border-white/20 shadow-2xl">
                  <div className="text-action-orange text-2xl sm:text-3xl font-black mb-0.5 tracking-tighter">1990</div>
                  <div className="text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em]">
                    {isBn ? 'প্রতিষ্ঠার বছর' : 'Founded in Dhaka'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products We Process — Scrolling Ticker */}
      <div className="bg-action-orange/5 dark:bg-orange-950/10 border-y border-action-orange/10 overflow-hidden py-2.5">
        <div className="flex items-center whitespace-nowrap">
          <div className="flex-shrink-0 flex items-center gap-2 bg-action-orange text-white px-4 py-2.5 text-[10px] sm:text-[9px] font-black uppercase tracking-widest z-10 self-stretch">
            <Package className="w-3 h-3 flex-shrink-0" />
            <span>{isBn ? 'আমরা প্রক্রিয়া করি' : 'We Process'}</span>
          </div>
          <motion.div
            className="flex items-center gap-6 pl-6"
            animate={{ x: [0, -2800] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          >
            {[...PROCESSABLE, ...PROCESSABLE].map((p, i) => (
              <span key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs sm:text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                <span className="w-1 h-1 rounded-full bg-action-orange inline-block flex-shrink-0" />
                {p}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Industrial Solutions Catalogue */}
      <section className="py-8 sm:py-20 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-14"
          >
            <span className="text-action-orange font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[9px] sm:text-[10px] mb-2 sm:mb-3 block">
              {isBn ? 'আমাদের মেশিনারি পরিসর' : 'Our Machinery Range'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
              {isBn ? (
                <>সম্পূর্ণ শিল্প <span className="text-action-orange">সমাধান ক্যাটালগ</span></>
              ) : (
                <>Complete Industrial <span className="text-action-orange">Solutions Catalogue</span></>
              )}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
              {isBn
                ? 'খাদ্য থেকে ফার্মাসিউটিক্যাল, পানীয় থেকে কসমেটিক্স — আমাদের ২২+ ক্যাটাগরির মেশিনারি আপনার সম্পূর্ণ শিল্প উৎপাদনকে সহজ করে তোলে।'
                : 'From food to pharmaceuticals, beverages to cosmetics — our 22+ machine categories power every aspect of your industrial production.'}
            </p>
          </motion.div>

          {/* Catalogue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {CATALOGUE.map((item, index) => {
              const Icon = item.icon;
              // Map color keys to Tailwind classes
              const iconBg: Record<string, string> = {
                blue:   'bg-blue-50 dark:bg-blue-950/30 group-hover:bg-blue-600',
                orange: 'bg-orange-50 dark:bg-orange-950/30 group-hover:bg-action-orange',
                yellow: 'bg-yellow-50 dark:bg-yellow-950/30 group-hover:bg-yellow-500',
                amber:  'bg-amber-50 dark:bg-amber-950/30 group-hover:bg-amber-600',
                green:  'bg-emerald-50 dark:bg-emerald-950/30 group-hover:bg-emerald-600',
                olive:  'bg-lime-50 dark:bg-lime-950/30 group-hover:bg-lime-600',
                teal:   'bg-teal-50 dark:bg-teal-950/30 group-hover:bg-teal-600',
                indigo: 'bg-indigo-50 dark:bg-indigo-950/30 group-hover:bg-indigo-600',
                purple: 'bg-violet-50 dark:bg-violet-950/30 group-hover:bg-violet-600',
                rose:   'bg-rose-50 dark:bg-rose-950/30 group-hover:bg-rose-600',
              };
              const iconColor: Record<string, string> = {
                blue:   'text-blue-600',
                orange: 'text-action-orange',
                yellow: 'text-yellow-600',
                amber:  'text-amber-600',
                green:  'text-emerald-600',
                olive:  'text-lime-600',
                teal:   'text-teal-600',
                indigo: 'text-indigo-600',
                purple: 'text-violet-600',
                rose:   'text-rose-600',
              };
              // Last item (Importer/Manufacturer) spans full width on md
              const isFullRow = index === CATALOGUE.length - 1;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.07, 0.5), duration: 0.6 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={isFullRow ? 'sm:col-span-2 lg:col-span-3 xl:col-span-5' : ''}
                >
                  <div
                    className={`group flex ${isFullRow ? 'flex-row items-center gap-4 sm:gap-6' : 'flex-col'} h-full p-4 sm:p-6 bg-gray-50 dark:bg-slate-900/60 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-action-orange/30 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-action-orange/5 transition-colors duration-300 cursor-default`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 ${iconBg[item.color]} ${isFullRow ? '' : 'mb-3 sm:mb-4'}`}
                    >
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor[item.color]} group-hover:text-white transition-colors duration-300`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-1 sm:mb-2 transition-colors duration-300 ${isFullRow ? 'text-xs sm:text-base' : 'text-[11px] sm:text-sm'}`}>
                        {isBn ? item.bn : item.en}
                      </h3>
                      <p className={`text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors duration-300 ${isFullRow ? 'text-[10px] sm:text-sm' : 'text-[10px] sm:text-[11px] line-clamp-3'}`}>
                        {isBn ? item.descBn : item.descEn}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3.5 bg-action-orange text-white font-black text-[11px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-lg sm:rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-action-orange/20 active:scale-95 touch-manipulation min-h-[40px]"
            >
              {isBn ? 'সম্পূর্ণ পণ্য তালিকা দেখুন' : 'Browse Full Product Catalogue'}
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-3 px-7 py-3.5 bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              {isBn ? 'কোটেশন চান' : 'Request a Quotation'}
            </Link>
          </motion.div>
        </div>
      </section>

      <IndustriesSection />

      <TrustedPartners />

      {/* Dynamic Product Categories - Refined Design */}
      <div className="bg-gray-50 dark:bg-slate-950/50 py-10 sm:py-14 border-y border-gray-100 dark:border-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <span className="text-action-orange font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">
            {isBn ? 'পণ্য শোকেস' : 'Product Showcase'}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {isBn ? (
              <>বৈশিষ্ট্যপূর্ণ <span className="text-gray-300 dark:text-slate-800">প্রযুক্তিগত</span> উৎকর্ষ</>
            ) : (
              <>Featured <span className="text-gray-300 dark:text-slate-800">Technological</span> Excellence</>
            )}
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
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-action-orange/20 blur-[160px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 uppercase tracking-tighter leading-tight">
              {isBn
                ? 'অটো প্যাক মানে, হাতের ছোঁয়া ছাড়াই স্বয়ংক্রিয় ভাবে প্যাক করা'
                : <><span>Advanced Industrial</span><br /><span>Automation Starts Here</span></>}
            </h2>
            <p className="text-gray-400 font-bold mb-16 max-w-2xl mx-auto text-xl uppercase tracking-tight">
              {isBn
                ? 'আপনার মেশিনারির কোটেশন পেতে আজই আমাদের সাথে যোগাযোগ করুন।'
                : 'Optimize your production line with world-class engineering. Request your custom machinery quotation today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center bg-action-orange text-white font-black py-6 px-12 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-2xl shadow-action-orange/30 hover:-translate-y-2 active:scale-95"
              >
                {isBn ? 'কোটেশন চান' : 'Request Quote'} <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-3 transition-transform duration-500" />
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-4 bg-white/5 text-white font-black py-6 px-12 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-3xl border border-white/10 hover:-translate-y-2 active:scale-95"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                WhatsApp {isBn ? 'আমাদের' : 'Us'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
