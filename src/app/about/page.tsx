'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useCompany, useOwner, useCategories, useIndustries, useTestimonials } from '@/hooks/useSiteData';
import PageHero from '@/components/PageHero';
import QuoteBand from '@/components/QuoteBand';
import {
  Factory, Wrench, Globe, CheckCircle, Star, Package, Eye, Target, Quote,
} from 'lucide-react';

const WHY_CHOOSE = [
  {
    icon: Factory,
    titleEn: 'Manufacturer & Importer Since 1990',
    titleBn: '১৯৯০ সাল থেকে প্রস্তুতকারক ও আমদানিকারক',
    descEn: 'Over three decades of direct manufacturing and importing, with authentic quality and no intermediaries.',
    descBn: 'তিন দশকেরও বেশি সময় ধরে সরাসরি উৎপাদন ও আমদানি — নির্ভরযোগ্য মান, প্রতিযোগিতামূলক মূল্য।',
  },
  {
    icon: Wrench,
    titleEn: 'End-to-End Service Support',
    titleBn: 'সম্পূর্ণ সার্ভিস সহায়তা',
    descEn: 'Installation, calibration, spare parts, and ongoing maintenance from in-house engineers.',
    descBn: 'ইনস্টলেশন থেকে ক্যালিব্রেশন — আমাদের ইঞ্জিনিয়ারিং টিম বিক্রয়-পরবর্তী সেবা নিশ্চিত করে।',
  },
  {
    icon: Globe,
    titleEn: 'World-Class Equipment',
    titleBn: 'বিশ্বমানের যন্ত্রপাতি',
    descEn: 'Machinery from leading global manufacturers, specified for Bangladeshi production lines.',
    descBn: 'বিশ্বের শীর্ষস্থানীয় প্রস্তুতকারকদের কাছ থেকে মেশিনারি — আন্তর্জাতিক মানসম্পন্ন পারফরম্যান্স।',
  },
  {
    icon: Package,
    titleEn: '22+ Machine Categories',
    titleBn: '২২+ মেশিন ক্যাটাগরি',
    descEn: 'From powder filling to juice plants, water treatment to blow moulding — one partner.',
    descBn: 'পাউডার ফিলিং থেকে জুস প্ল্যান্ট, ওয়াটার ট্রিটমেন্ট থেকে ব্লো মোল্ডিং — সব প্রয়োজনে এক অংশীদার।',
  },
  {
    icon: CheckCircle,
    titleEn: 'Customised Solutions',
    titleBn: 'কাস্টমাইজড সমাধান',
    descEn: 'Specifications adapted to capacity, product type, budget, and factory layout.',
    descBn: 'উৎপাদন সক্ষমতা, পণ্যের ধরন, বাজেট এবং ফ্যাক্টরি লেআউট অনুযায়ী কাস্টম সমাধান।',
  },
  {
    icon: Star,
    titleEn: 'Trusted by 300+ Clients',
    titleBn: '৩০০+ ক্লায়েন্টের বিশ্বাস',
    descEn: 'Factories across Bangladesh — SMEs to large plants — run Auto Pac machinery daily.',
    descBn: 'বাংলাদেশের শত শত কারখানা প্রতিদিনের উৎপাদনে অটো প্যাকের মেশিনারির উপর নির্ভরশীল।',
  },
];

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

const MILESTONES = [
  { year: '1990', titleEn: 'Company Founded', titleBn: 'প্রতিষ্ঠিত', descEn: 'Specialist importer of food processing and packaging machinery in Dhaka.', descBn: 'ঢাকায় খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং যন্ত্রপাতির বিশেষজ্ঞ আমদানিকারক হিসেবে প্রতিষ্ঠিত।' },
  { year: '2000', titleEn: 'Manufacturing Expansion', titleBn: 'উৎপাদন সম্প্রসারণ', descEn: 'Local manufacturing for custom machinery tailored to Bangladeshi industries.', descBn: 'স্থানীয় উৎপাদনে প্রসারিত — বাংলাদেশী শিল্পের উপযোগী কাস্টম সমাধান।' },
  { year: '2010', titleEn: 'Industry Diversification', titleBn: 'শিল্প বৈচিত্র্য', descEn: 'Portfolio expanded to pharma, cosmetics, Ayurvedic, and chemical lines.', descBn: 'ফার্মাসিউটিক্যাল, কসমেটিকস, আয়ুর্বেদিক ও রাসায়নিক খাতে পণ্য বৈচিত্র্য বৃদ্ধি।' },
  { year: '2020+', titleEn: 'Digital & Modern Era', titleBn: 'ডিজিটাল যুগ', descEn: '500+ machines delivered, serving 300+ clients across Bangladesh.', descBn: '৫০০+ মেশিন সরবরাহ, ৩০০+ ক্লায়েন্টকে বিশ্বমানের অটোমেশন সেবা।' },
];

export default function AboutPage() {
  const { locale } = useLocale();
  const [company] = useCompany();
  const [owner] = useOwner();
  const [categories] = useCategories();
  const [industries] = useIndustries();
  const [testimonials] = useTestimonials();
  const isEn = locale !== 'bn';

  return (
    <div className="page-shell">
      <PageHero
        kicker={isEn ? 'About Auto Pac' : 'আমাদের সম্পর্কে'}
        title={isEn ? "Bangladesh's machinery partner since 1990" : '১৯৯০ সাল থেকে বাংলাদেশের মেশিনারি অংশীদার'}
        description={
          isEn
            ? company?.taglineEn || 'Importer, manufacturer, and supplier of food processing and packaging machinery from Kawran Bazar, Dhaka.'
            : company?.taglineBn || 'কাওরান বাজার, ঢাকা থেকে খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারির আমদানিকারক, প্রস্তুতকারক ও সরবরাহকারী।'
        }
        actions={
          <>
            <Link href="/contact" className="btn-primary">
              {isEn ? 'Request a quote' : 'কোটেশন চান'}
            </Link>
            <Link href="/products" className="btn-secondary">
              {isEn ? 'Browse machinery' : 'মেশিনারি দেখুন'}
            </Link>
          </>
        }
      />

      <section className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '500+', label: isEn ? 'Machines delivered' : 'মেশিন সরবরাহ' },
            { value: '300+', label: isEn ? 'Clients' : 'ক্লায়েন্ট' },
            { value: '22+', label: isEn ? 'Machine types' : 'মেশিন ধরন' },
            { value: '35+', label: isEn ? 'Years' : 'বছর' },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-semibold text-brand-maroon tracking-tight">{s.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-stone-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="section-kicker mb-3">{isEn ? 'Our story' : 'আমাদের গল্প'}</p>
            <h2 className="page-title text-3xl">
              {isEn ? 'Three decades of industrial trust' : 'তিন দশকের শিল্প বিশ্বাস'}
            </h2>
            <div className="mt-5 space-y-4 text-stone-600 dark:text-stone-400 leading-relaxed">
              {(isEn ? company?.aboutEn : company?.aboutBn) ? (
                <p className="whitespace-pre-line">{isEn ? company?.aboutEn : company?.aboutBn}</p>
              ) : (
                <>
                  <p>
                    {isEn
                      ? 'Auto Pac was established in 1990 in Kawran Bazar, Dhaka, to bring world-class food processing and packaging machinery to Bangladesh. What began as a specialist importer is now a manufacturer, importer, supplier, and service partner.'
                      : 'অটো প্যাক ১৯৯০ সালে ঢাকার কাওরান বাজারে প্রতিষ্ঠিত হয়েছিল বাংলাদেশের শিল্প খাতে বিশ্বমানের মেশিনারি আনার লক্ষ্যে।'}
                  </p>
                  <p>
                    {isEn
                      ? 'Today we serve 300+ clients — from small enterprises to large plants — with automatic and semi-automatic lines for food, beverage, pharma, cosmetics, Ayurvedic, Unani, and chemical production.'
                      : 'আজ অটো প্যাক ৩০০+ ক্লায়েন্টকে খাদ্য, পানীয়, ফার্মা, কসমেটিকস ও রাসায়নিক শিল্পের জন্য মেশিনারি সরবরাহ করে।'}
                  </p>
                </>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="surface-card p-5">
                <Eye className="w-5 h-5 text-brand-maroon mb-3" />
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-2">
                  {isEn ? 'Vision' : 'দৃষ্টিভঙ্গি'}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {(isEn ? company?.visionEn : company?.visionBn) ||
                    (isEn
                      ? 'To be the most trusted industrial automation partner in the region.'
                      : 'অঞ্চলের সবচেয়ে বিশ্বস্ত শিল্প অটোমেশন অংশীদার হওয়া।')}
                </p>
              </div>
              <div className="surface-card p-5">
                <Target className="w-5 h-5 text-brand-maroon mb-3" />
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-2">
                  {isEn ? 'Mission' : 'মিশন'}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {(isEn ? company?.missionEn : company?.missionBn) ||
                    (isEn
                      ? 'World-class machinery with after-sales support that keeps lines running.'
                      : 'বিশ্বমানের মেশিনারি ও বিক্রয়োত্তর সেবা দিয়ে উৎপাদন চালু রাখা।')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-md overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100">
              <Image
                src="/images/slider2.png"
                alt="Auto Pac machinery"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MILESTONES.map((m) => (
                <div key={m.year} className="surface-card p-4">
                  <p className="text-sm font-semibold text-brand-maroon">{m.year}</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-white">
                    {isEn ? m.titleEn : m.titleBn}
                  </p>
                  <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                    {isEn ? m.descEn : m.descBn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white dark:bg-stone-950 border-y border-stone-200 dark:border-stone-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-kicker mb-3">{isEn ? 'Why Auto Pac' : 'কেন অটো প্যাক'}</p>
          <h2 className="page-title text-3xl mb-8">
            {isEn ? 'What factory owners actually get' : 'কারখানা মালিকরা যা পান'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_CHOOSE.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.titleEn} className="surface-card p-6">
                  <Icon className="w-5 h-5 text-brand-maroon mb-4" />
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-2">
                    {isEn ? item.titleEn : item.titleBn}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {isEn ? item.descEn : item.descBn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {industries.length > 0 && (
        <section className="section-pad">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="section-kicker mb-3">{isEn ? 'Sectors' : 'শিল্প'}</p>
            <h2 className="page-title text-3xl mb-8">{isEn ? 'Industries we serve' : 'আমরা যে শিল্পকে সেবা দিই'}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {industries.map((ind) => (
                <div key={ind.id} className="surface-card p-5">
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                    {isEn ? ind.nameEn : ind.nameBn}
                  </h3>
                  {(isEn ? ind.descriptionEn : ind.descriptionBn) && (
                    <p className="mt-2 text-xs text-stone-500 leading-relaxed">
                      {isEn ? ind.descriptionEn : ind.descriptionBn}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="section-pad bg-white dark:bg-stone-950 border-y border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="section-kicker mb-3">{isEn ? 'Catalogue' : 'ক্যাটালগ'}</p>
            <h2 className="page-title text-3xl mb-8">{isEn ? 'Browse by machine category' : 'মেশিন ক্যাটাগরি'}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="surface-card p-5 hover:border-brand-maroon transition-colors"
                >
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                    {isEn ? cat.nameEn : cat.nameBn}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-kicker mb-3">{isEn ? 'What we pack' : 'যা প্যাক করি'}</p>
          <h2 className="page-title text-3xl mb-6">
            {isEn ? 'Products our machinery processes' : 'যে পণ্যগুলো আমরা প্রক্রিয়া করি'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {PROCESSABLE_PRODUCTS.map((product) => (
              <Link
                key={product}
                href={`/products?q=${encodeURIComponent(product)}`}
                className="px-3 py-1.5 text-sm border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-brand-maroon hover:text-brand-maroon"
              >
                {product}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {owner && (
        <section className="section-pad bg-white dark:bg-stone-950 border-y border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[280px_1fr] gap-10 items-start">
            <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100">
              <Image
                src={owner.photoUrl || '/images/slider3.png'}
                alt={isEn ? owner.nameEn : owner.nameBn}
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
            <div>
              <p className="section-kicker mb-3">{isEn ? 'Leadership' : 'নেতৃত্ব'}</p>
              <h2 className="page-title text-3xl mb-4">{isEn ? 'Executive message' : 'নির্বাহীর বার্তা'}</h2>
              <Quote className="w-6 h-6 text-brand-maroon mb-3" aria-hidden="true" />
              <blockquote className="text-lg text-stone-800 dark:text-stone-200 leading-relaxed">
                {isEn ? owner.messageEn : owner.messageBn}
              </blockquote>
              {(isEn ? owner.bioEn : owner.bioBn) && (
                <p className="mt-5 text-sm text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-line">
                  {isEn ? owner.bioEn : owner.bioBn}
                </p>
              )}
              <p className="mt-6 text-sm font-semibold text-stone-900 dark:text-white">
                {isEn ? owner.nameEn : owner.nameBn}
              </p>
              <p className="text-sm text-stone-500">{isEn ? owner.titleEn : owner.titleBn}</p>
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section-pad">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="section-kicker mb-3">{isEn ? 'Clients' : 'ক্লায়েন্ট'}</p>
            <h2 className="page-title text-3xl mb-8">
              {isEn ? 'What factory owners say' : 'কারখানা মালিকরা যা বলেন'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((item) => (
                <article key={item.id} className="surface-card p-5 flex flex-col">
                  <div className="flex gap-0.5 mb-3" aria-label={`${item.rating} of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating ? 'text-brand-maroon fill-brand-maroon' : 'text-stone-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed flex-1">
                    {isEn ? item.messageEn : item.messageBn}
                  </p>
                  <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">
                      {isEn ? item.nameEn : item.nameBn}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {[item.designation, item.company].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuoteBand />
    </div>
  );
}
