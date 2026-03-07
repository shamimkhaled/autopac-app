'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useCompany, useOwner, useCategories, useIndustries } from '@/hooks/useSiteData';
import {
  Shield, Award, Users, Settings, Target, Eye, ArrowRight, Quote,
  Factory, Wrench, Globe, CheckCircle, Phone, MessageSquare,
  Package, Zap, Star, TrendingUp,
} from 'lucide-react';

// Static facts derived from the original Auto Pac business profile (HTML)
const WHY_CHOOSE = [
  {
    icon: Factory,
    titleEn: 'Manufacturer & Importer Since 1990',
    titleBn: '১৯৯০ সাল থেকে প্রস্তুতকারক ও আমদানিকারক',
    descEn: 'Over three decades of direct manufacturing and importing, guaranteeing authentic quality, competitive pricing, and zero intermediaries.',
    descBn: 'তিন দশকেরও বেশি সময় ধরে সরাসরি উৎপাদন ও আমদানি — নির্ভরযোগ্য মান, প্রতিযোগিতামূলক মূল্য।',
  },
  {
    icon: Wrench,
    titleEn: 'End-to-End Service Support',
    titleBn: 'সম্পূর্ণ সার্ভিস সহায়তা',
    descEn: 'From installation to calibration, our in-house engineers provide after-sales service, spare parts, and ongoing maintenance.',
    descBn: 'ইনস্টলেশন থেকে ক্যালিব্রেশন — আমাদের ইঞ্জিনিয়ারিং টিম বিক্রয়-পরবর্তী সেবা নিশ্চিত করে।',
  },
  {
    icon: Globe,
    titleEn: 'World-Class Equipment',
    titleBn: 'বিশ্বমানের যন্ত্রপাতি',
    descEn: 'We source machinery from leading global manufacturers, ensuring international-grade performance adapted for Bangladeshi production needs.',
    descBn: 'বিশ্বের শীর্ষস্থানীয় প্রস্তুতকারকদের কাছ থেকে মেশিনারি — আন্তর্জাতিক মানসম্পন্ন পারফরম্যান্স।',
  },
  {
    icon: Package,
    titleEn: '22+ Machine Categories',
    titleBn: '২২+ মেশিন ক্যাটাগরি',
    descEn: 'From powder filling to juice plants, water treatment to blow moulding — one trusted partner for all your industrial automation needs.',
    descBn: 'পাউডার ফিলিং থেকে জুস প্ল্যান্ট, ওয়াটার ট্রিটমেন্ট থেকে ব্লো মোল্ডিং — সব প্রয়োজনে একমাত্র বিশ্বস্ত অংশীদার।',
  },
  {
    icon: CheckCircle,
    titleEn: 'Customised Solutions',
    titleBn: 'কাস্টমাইজড সমাধান',
    descEn: 'We design and adapt machinery specifications to your production capacity, product type, budget, and factory layout.',
    descBn: 'উৎপাদন সক্ষমতা, পণ্যের ধরন, বাজেট এবং ফ্যাক্টরি লেআউট অনুযায়ী কাস্টম মেশিনারি সমাধান।',
  },
  {
    icon: Star,
    titleEn: 'Trusted by 300+ Clients',
    titleBn: '৩০০+ ক্লায়েন্টের বিশ্বাস',
    descEn: 'Hundreds of factories across Bangladesh rely on Auto Pac machinery to power their daily production — from SMEs to large industrial plants.',
    descBn: 'বাংলাদেশের শত শত কারখানা প্রতিদিনের উৎপাদনে অটো প্যাকের মেশিনারির উপর নির্ভরশীল।',
  },
];

// Products Auto Pac can help process/pack — from the original HTML business profile
const PROCESSABLE_PRODUCTS = [
  'Atta', 'Maida', 'Suji', 'Rice', 'Dal', 'Muri', 'Sugar', 'Salt',
  'Biscuit', 'Potato Chips', 'Chanachur', 'Tea', 'Coffee', 'Peanut',
  'Candy', 'Drink Powder', 'Milk Powder', 'Spices Masala', 'Instant Noodles',
  'Mango Bar', 'Chocolate Bar', 'Snacks', 'Dry Fruits', 'Cake',
  'Mineral Water', 'Mango Juice', 'Orange Juice', 'Lichi Juice',
  'Energy Drinks', 'Carbonated Drinks', 'Tomato Sauce', 'Jam',
  'Jelly', 'Honey', 'Milk', 'Mustard Oil', 'Soyabean Oil',
  'Mosquito Coil', 'Washing Powder', 'Soap', 'Shampoo',
  'Talcum Powder', 'Mehedi', 'Hair Colour', 'Shaving Cream',
  'Fairness Cream', 'Ayurvedic Products', 'Unani Products',
  'Pharmaceuticals', 'Ghee', 'Ice Pop', 'Tissue Paper',
];

// Company milestones — static historical data from the business profile
const MILESTONES = [
  { year: '1990', titleEn: 'Company Founded', titleBn: 'প্রতিষ্ঠিত', descEn: 'Auto Pac established in Dhaka as a specialist importer of food processing and packaging machinery.', descBn: 'ঢাকায় খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং যন্ত্রপাতির বিশেষজ্ঞ আমদানিকারক হিসেবে অটো প্যাক প্রতিষ্ঠিত।' },
  { year: '2000', titleEn: 'Manufacturing Expansion', titleBn: 'উৎপাদন সম্প্রসারণ', descEn: 'Expanded into local manufacturing, providing custom machinery solutions tailored for Bangladeshi industries.', descBn: 'স্থানীয় উৎপাদনে প্রসারিত — বাংলাদেশী শিল্পের উপযোগী কাস্টম সমাধান।' },
  { year: '2010', titleEn: 'Industry Diversification', titleBn: 'শিল্প বৈচিত্র্য', descEn: 'Diversified product portfolio to cover pharmaceutical, cosmetics, Ayurvedic, and chemical manufacturing sectors.', descBn: 'ফার্মাসিউটিক্যাল, কসমেটিকস, আয়ুর্বেদিক ও রাসায়নিক খাতে পণ্য বৈচিত্র্য বৃদ্ধি।' },
  { year: '2020+', titleEn: 'Digital & Modern Era', titleBn: 'ডিজিটাল যুগ', descEn: '500+ machines delivered, 22+ product categories, serving 300+ clients across Bangladesh with world-class automation.', descBn: '৫০০+ মেশিন সরবরাহ, ২২+ পণ্য বিভাগ, ৩০০+ ক্লায়েন্টকে বিশ্বমানের অটোমেশন সেবা।' },
];

export default function AboutPage() {
  const { locale } = useLocale();
  const [company] = useCompany();
  const [owner] = useOwner();
  const [categories] = useCategories();
  const [industries] = useIndustries();

  const isEn = locale !== 'bn';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 lg:py-40 bg-industrial-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/slider1.png')] bg-cover bg-center opacity-10 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-industrial-dark/60 to-industrial-dark" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-action-orange/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-action-orange rounded-full" />
              <span className="text-action-orange font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs">
                {isEn ? 'About AutoPac' : 'আমাদের সম্পর্কে'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-tight mb-6">
              {isEn ? (
                <>Bangladesh&apos;s Premier<br /><span className="text-action-orange">Machinery Partner</span></>
              ) : (
                <>বাংলাদেশের শীর্ষ<br /><span className="text-action-orange">মেশিনারি অংশীদার</span></>
              )}
            </h1>
            <p className="text-white/60 text-base sm:text-xl font-medium max-w-2xl leading-relaxed italic border-l-4 border-action-orange pl-6">
              {isEn ? company?.taglineEn : company?.taglineBn}
            </p>

            {/* Founded badge */}
            <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-action-orange/20 border border-action-orange/30 rounded-full">
                <Zap className="w-3.5 h-3.5 text-action-orange" />
                <span className="text-action-orange font-black text-xs uppercase tracking-widest">
                  {isEn ? 'Est. 1990' : 'প্রতিষ্ঠিত ১৯৯০'}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full">
                <Globe className="w-3.5 h-3.5 text-white/60" />
                <span className="text-white/60 font-black text-xs uppercase tracking-widest">
                  {isEn ? 'Dhaka, Bangladesh' : 'ঢাকা, বাংলাদেশ'}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full">
                <Factory className="w-3.5 h-3.5 text-white/60" />
                <span className="text-white/60 font-black text-xs uppercase tracking-widest">
                  {isEn ? 'Importer · Manufacturer · Supplier' : 'আমদানিকারক · প্রস্তুতকারক · সরবরাহকারী'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS CARDS ──────────────────────────────────────────────────── */}
      <section className="relative z-20 -mt-12 sm:-mt-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: TrendingUp, value: '500+', labelEn: 'Machines Delivered', labelBn: 'মেশিন সরবরাহ', color: 'orange' },
            { icon: Users,      value: '300+', labelEn: 'Happy Clients',      labelBn: 'সন্তুষ্ট ক্লায়েন্ট', color: 'blue' },
            { icon: Settings,   value: '22+',  labelEn: 'Machine Categories', labelBn: 'মেশিন বিভাগ', color: 'green' },
            { icon: Award,      value: '35+',  labelEn: 'Years of Excellence', labelBn: 'বছরের অভিজ্ঞতা', color: 'purple' },
          ].map((s, i) => {
            const Icon = s.icon;
            const bgMap: Record<string, string> = {
              orange: 'bg-orange-50 dark:bg-orange-950/20',
              blue:   'bg-blue-50 dark:bg-blue-950/20',
              green:  'bg-emerald-50 dark:bg-emerald-950/20',
              purple: 'bg-violet-50 dark:bg-violet-950/20',
            };
            const iconMap: Record<string, string> = {
              orange: 'text-action-orange',
              blue:   'text-blue-600',
              green:  'text-emerald-600',
              purple: 'text-violet-600',
            };
            return (
              <div
                key={i}
                className={`${bgMap[s.color]} p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white dark:border-slate-800 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${iconMap[s.color]}`} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">{s.value}</h3>
                <p className="text-[11px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">
                  {isEn ? s.labelEn : s.labelBn}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── COMPANY STORY ────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="space-y-8 order-2 lg:order-1">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-0.5 bg-action-orange" />
                <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px]">
                  {isEn ? 'Our Story' : 'আমাদের গল্প'}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-4">
                {isEn ? (
                  <>Three Decades of<br /><span className="text-action-orange">Industrial Trust</span></>
                ) : (
                  <>তিন দশকের<br /><span className="text-action-orange">শিল্প বিশ্বাস</span></>
                )}
              </h2>
              <div className="w-16 h-1.5 bg-action-orange rounded-full" />
            </div>

            <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium space-y-4 text-sm sm:text-base">
              {(isEn ? company?.aboutEn : company?.aboutBn) ? (
                <p className="whitespace-pre-line">
                  {isEn ? company?.aboutEn : company?.aboutBn}
                </p>
              ) : (
                <>
                  <p>
                    {isEn
                      ? 'Auto Pac was established in 1990 in Kawran Bazar, Dhaka, with a singular mission: to bring world-class food processing and packaging machinery to Bangladesh\'s growing industrial sector. What began as a specialist importer has evolved into a full-service manufacturer, importer, supplier, and maintenance provider.'
                      : 'অটো প্যাক ১৯৯০ সালে ঢাকার কাওরান বাজারে প্রতিষ্ঠিত হয়েছিল একটি লক্ষ্য নিয়ে: বাংলাদেশের ক্রমবর্ধমান শিল্প খাতে বিশ্বমানের খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারি আনা।'}
                  </p>
                  <p>
                    {isEn
                      ? 'Today, Auto Pac serves 300+ clients across Bangladesh — from small enterprises to large industrial plants — providing fully automatic and semi-automatic machinery for the food, beverage, pharmaceutical, cosmetics, Ayurvedic, Unani, and chemical industries.'
                      : 'আজ, অটো প্যাক বাংলাদেশে ৩০০+ ক্লায়েন্টকে সেবা দেয় — ছোট উদ্যোগ থেকে বড় শিল্প প্রতিষ্ঠান পর্যন্ত — খাদ্য, পানীয়, ফার্মাসিউটিক্যাল, কসমেটিকস ও রাসায়নিক শিল্পের জন্য স্বয়ংক্রিয় মেশিনারি সরবরাহ করে।'}
                  </p>
                </>
              )}
            </div>

            {/* Vision & Mission */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 sm:p-6 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-xs font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest">
                  {isEn ? 'Our Vision' : 'আমাদের দৃষ্টিভঙ্গি'}
                </h4>
                <p className="text-xs text-blue-700/70 dark:text-blue-400/70 font-medium leading-relaxed">
                  {(isEn ? company?.visionEn : company?.visionBn) ||
                    (isEn
                      ? 'To be the most trusted partner for industrial automation across South Asia, empowering manufacturers with world-class machinery and service.'
                      : 'দক্ষিণ এশিয়ার শিল্প অটোমেশনের সবচেয়ে বিশ্বস্ত অংশীদার হওয়া।')}
                </p>
              </div>
              <div className="p-5 sm:p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 space-y-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest">
                  {isEn ? 'Our Mission' : 'আমাদের মিশন'}
                </h4>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 font-medium leading-relaxed">
                  {(isEn ? company?.missionEn : company?.missionBn) ||
                    (isEn
                      ? 'To deliver world-class machinery with exceptional after-sales support, helping Bangladeshi manufacturers compete on the global stage.'
                      : 'বিশ্বমানের মেশিনারি ও বিক্রয়োত্তর সেবা দিয়ে বাংলাদেশী উৎপাদনকারীদের বৈশ্বিক প্রতিযোগিতায় সহায়তা করা।')}
                </p>
              </div>
            </div>
          </div>

          {/* Image + timeline */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/slider2.png"
                alt="Auto Pac Factory"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-industrial-dark/80 via-industrial-dark/20 to-transparent" />
              <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8">
                <p className="text-action-orange font-black text-[10px] uppercase tracking-[0.3em] mb-1">
                  {isEn ? 'Est.' : 'প্রতিষ্ঠিত'} 1990
                </p>
                <h3 className="text-white font-black text-xl sm:text-2xl uppercase tracking-tight leading-tight">
                  {isEn ? 'Auto Pac' : 'অটো প্যাক'}<br />
                  <span className="text-white/50 text-sm sm:text-base">Kawran Bazar, Dhaka</span>
                </h3>
              </div>
            </div>

            {/* Compact timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MILESTONES.map((m) => (
                <div
                  key={m.year}
                  className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 hover:-translate-y-0.5 transition-transform"
                >
                  <span className="text-action-orange font-black text-sm sm:text-base">{m.year}</span>
                  <p className="font-black text-slate-900 dark:text-white text-xs mt-0.5 uppercase tracking-tight">
                    {isEn ? m.titleEn : m.titleBn}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium leading-relaxed mt-1 line-clamp-2">
                    {isEn ? m.descEn : m.descBn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE AUTO PAC ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-slate-900/50 border-y border-gray-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-3 block">
              {isEn ? 'Our Advantage' : 'আমাদের সুবিধা'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {isEn ? (
                <>Why Choose <span className="text-action-orange">Auto Pac?</span></>
              ) : (
                <>কেন <span className="text-action-orange">অটো প্যাক</span> বেছে নেবেন?</>
              )}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {WHY_CHOOSE.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-700 hover:border-action-orange/30 hover:shadow-xl hover:shadow-action-orange/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 dark:bg-orange-950/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 group-hover:bg-action-orange transition-colors duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-action-orange group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base uppercase tracking-tight leading-tight mb-3">
                    {isEn ? item.titleEn : item.titleBn}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
                    {isEn ? item.descEn : item.descBn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES WE SERVE ──────────────────────────────────────────── */}
      {industries.length > 0 && (
        <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-3 block">
              {isEn ? 'Sectors We Power' : 'যে শিল্পে আমরা কাজ করি'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {isEn ? (
                <>Industries <span className="text-action-orange">We Serve</span></>
              ) : (
                <>আমরা যে শিল্পকে <span className="text-action-orange">সেবা দিই</span></>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {industries.map((ind, i) => (
              <div
                key={ind.id || i}
                className="group p-5 sm:p-6 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-action-orange/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-action-orange transition-colors">
                  <Factory className="w-4 h-4 sm:w-5 sm:h-5 text-action-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm uppercase tracking-tight leading-tight">
                  {isEn ? ind.nameEn : ind.nameBn}
                </h3>
                {(isEn ? ind.descriptionEn : ind.descriptionBn) && (
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium mt-2 line-clamp-2 leading-relaxed">
                    {isEn ? ind.descriptionEn : ind.descriptionBn}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MACHINE CATEGORIES ───────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16 sm:py-24 bg-industrial-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-action-orange/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-3 block">
                {isEn ? '22+ Machine Types' : '২২+ মেশিন ধরন'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                {isEn ? (
                  <>Our Machine <span className="text-action-orange">Catalogue</span></>
                ) : (
                  <>আমাদের মেশিন <span className="text-action-orange">ক্যাটালগ</span></>
                )}
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mt-3 font-medium text-sm">
                {isEn
                  ? 'Fully automatic, semi-automatic, and complete plant solutions across all major processing and packaging industries.'
                  : 'সম্পূর্ণ স্বয়ংক্রিয়, আধা-স্বয়ংক্রিয় এবং সম্পূর্ণ প্ল্যান্ট সমাধান।'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id || i}
                  href={`/products?category=${cat.slug}`}
                  className="group p-4 sm:p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-action-orange/40 rounded-xl sm:rounded-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-action-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-action-orange transition-colors">
                      <Package className="w-4 h-4 text-action-orange group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-white text-[10px] sm:text-xs uppercase tracking-tight leading-tight line-clamp-2">
                        {isEn ? cat.nameEn : cat.nameBn}
                      </h4>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-action-orange opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-black uppercase tracking-widest">View</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-action-orange text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/30 active:scale-95"
              >
                <Settings className="w-4 h-4" />
                {isEn ? 'Browse Machinery Gallery' : 'মেশিন গ্যালারি দেখুন'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUCTS WE PROCESS ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-3 block">
            {isEn ? 'Product Range' : 'পণ্য পরিসর'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
            {isEn ? (
              <>50+ Products We Help <span className="text-action-orange">Process & Pack</span></>
            ) : (
              <>৫০+ পণ্য আমরা <span className="text-action-orange">প্রক্রিয়া ও প্যাক</span> করি</>
            )}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-2xl mx-auto">
            {isEn
              ? 'Our machinery solutions cover the full spectrum of food, beverage, pharmaceutical, cosmetics, and industrial products.'
              : 'আমাদের মেশিনারি সমাধান খাদ্য, পানীয়, ফার্মাসিউটিক্যাল, কসমেটিকস এবং শিল্প পণ্যের সম্পূর্ণ পরিসর কভার করে।'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {PROCESSABLE_PRODUCTS.map((product) => (
            <span
              key={product}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg hover:border-action-orange/40 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-action-orange transition-all cursor-default"
            >
              {product}
            </span>
          ))}
        </div>

        <p className="text-center text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-8">
          {isEn ? '+ Many more products across all major industries' : '+ সমস্ত প্রধান শিল্পে আরও অনেক পণ্য'}
        </p>
      </section>

      {/* ── OWNER / EXECUTIVE MESSAGE ─────────────────────────────────────── */}
      {owner && (
        <section className="py-16 sm:py-24 bg-gray-50 dark:bg-slate-900/50 border-y border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-action-orange/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              <div className="w-full lg:w-[360px] flex-shrink-0">
                <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 group">
                  <Image
                    src={owner.photoUrl || '/images/slider3.png'}
                    alt={owner.nameEn}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-industrial-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      {isEn ? owner.nameEn : owner.nameBn}
                    </h3>
                    <p className="text-action-orange font-black text-[10px] uppercase tracking-[0.2em] mt-1">
                      {isEn ? owner.titleEn : owner.titleBn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div>
                  <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-3 block">
                    {isEn ? 'Leadership' : 'নেতৃত্ব'}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-3">
                    {isEn ? (
                      <>Executive <span className="text-gray-300 dark:text-slate-600">Message</span></>
                    ) : (
                      <>নির্বাহীর <span className="text-gray-300 dark:text-slate-600">বার্তা</span></>
                    )}
                  </h2>
                  <div className="w-16 h-1.5 bg-action-orange rounded-full" />
                </div>

                <div className="relative overflow-visible">
                  <Quote className="relative opacity-20 w-12 h-12 text-action-orange dark:text-slate-600 mb-2" aria-hidden="true" />
                  <blockquote className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed italic">
                    &ldquo;{isEn ? owner.messageEn : owner.messageBn}&rdquo;
                  </blockquote>
                </div>

                {(isEn ? owner.bioEn : owner.bioBn) && (
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {isEn ? owner.bioEn : owner.bioBn}
                  </p>
                )}

                <div className="flex items-center gap-5 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <div className="w-12 h-12 bg-action-orange/10 rounded-xl flex items-center justify-center">
                    <Quote className="w-5 h-5 text-action-orange" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white uppercase text-sm">
                      {isEn ? owner.nameEn : owner.nameBn}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
                      {isEn ? owner.titleEn : owner.titleBn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-industrial-dark rounded-2xl sm:rounded-[48px] p-6 sm:p-10 lg:p-16 relative overflow-hidden shadow-2xl text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-action-orange/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-action-orange/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 sm:space-y-8">
            <p className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
              {isEn ? 'Start Your Automation Journey' : 'আপনার অটোমেশন যাত্রা শুরু করুন'}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              {isEn ? (
                <>Ready to <span className="text-action-orange">Automate</span> Your Production?</>
              ) : (
                <>আপনার উৎপাদন <span className="text-action-orange">স্বয়ংক্রিয়</span> করতে প্রস্তুত?</>
              )}
            </h2>
            <p className="text-white/60 font-medium max-w-xl mx-auto text-sm sm:text-base">
              {isEn
                ? 'Connect with our engineering team today. Get a free consultation, custom machinery recommendations, and a competitive quotation within 24 hours.'
                : 'আজই আমাদের ইঞ্জিনিয়ারিং টিমের সাথে যোগাযোগ করুন। বিনামূল্যে পরামর্শ এবং ২৪ ঘণ্টার মধ্যে কোটেশন পান।'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-action-orange text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/30 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                {isEn ? 'Request a Quotation' : 'কোটেশন চান'}
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-white/20 transition-all border border-white/20 active:scale-95"
              >
                {isEn ? 'Browse Products' : 'পণ্য দেখুন'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${company?.whatsapp || '8801818496642'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl active:scale-95"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            {/* Contact details from DB */}
            {(company?.phone || company?.email) && (
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-4 border-t border-white/10 mt-4">
                {company.phone && (
                  <a href={`tel:+88${company.phone.split(/[,\s]/)[0].trim()}`} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold">
                    <Phone className="w-3.5 h-3.5" /> {company.phone}
                  </a>
                )}
                {company.email && (
                  <a href={`mailto:${company.email}`} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold">
                    <Shield className="w-3.5 h-3.5" /> {company.email}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
