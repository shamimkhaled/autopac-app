'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import HeroSlider from '@/components/HeroSlider';
import ProductCategory from '@/components/ProductCategory';
import TrustedPartners from '@/components/TrustedPartners';
import IndustriesSection from '@/components/IndustriesSection';
import { useProducts, useCategories, useCompany } from '@/hooks/useSiteData';
import type { Product, Category } from '@/lib/api';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { t, locale } = useLocale();
  const [products] = useProducts();
  const [categories] = useCategories();
  const [company] = useCompany();

  const whatsapp = company?.whatsapp || '8801818496642';

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <HeroSlider />

      {/* Intro Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-industrial-dark dark:text-white mb-6">
              {t('home.ourProducts') || 'Our Products'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed font-bengali">
              {t('home.ourProductsList') || 'We manufacture and import world-class packaging machinery.'}
            </p>
            <div className="mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-action-orange hover:bg-orange-600 text-white font-semibold rounded-full transition-colors shadow-md hover:shadow-lg"
              >
                {t('home.viewAll') || 'View All Products'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-industrial-dark dark:text-white text-center mb-10"
          >
            {t('home.quickCategories') || 'Browse by Category'}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat: { id: string; slug: string; nameEn: string; nameBn: string; descriptionEn?: string; descriptionBn?: string }, index: number) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-5 group-hover:bg-action-orange group-hover:text-white transition-colors">
                    <svg className="w-7 h-7 text-action-orange group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-industrial-dark dark:text-white mb-2 text-lg">
                    {locale === 'bn' ? cat.nameBn : cat.nameEn}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                    {locale === 'bn' ? cat.descriptionBn : cat.descriptionEn}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <IndustriesSection />

      <TrustedPartners />

      {/* Dynamic Product Categories */}
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
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

      {/* CTA Banner */}
      <section className="py-16 md:py-24 bg-action-orange dark:bg-orange-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              {locale === 'bn' ? 'অটো প্যাক মানে, হাতের ছোঁয়া ছাড়াই স্বয়ংক্রিয় ভাবে প্যাক করা' : 'Auto Pac — Pack automatically, without the touch of hands'}
            </h2>
            <p className="text-white/90 font-bengali mb-10 max-w-2xl mx-auto text-lg">
              {t('home.taglineBn') || 'Get your machinery quotation today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white text-action-orange font-bold py-3.5 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              >
                {t('products.requestQuote') || 'Request Quote'}
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-industrial-dark text-white font-bold py-3.5 px-8 rounded-full hover:bg-gray-800 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                {t('products.inquireWhatsApp') || 'WhatsApp Us'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
