'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import TrustedPartners from '@/components/TrustedPartners';
import IndustriesSection from '@/components/IndustriesSection';
import { useProducts, useCategories, useCompany } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';

export default function HomePage() {
  const { t, locale } = useLocale();
  const [products] = useProducts();
  const [categories] = useCategories();
  const [company] = useCompany();

  const featured = products.filter((p: Product) => p.featured).slice(0, 8);
  if (featured.length === 0) {
    featured.push(...products.slice(0, 8));
  }

  const whatsapp = company?.whatsapp || '8801818496642';

  return (
    <>
      <HeroSlider />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-industrial-dark text-center mb-12">
            {t('home.quickCategories')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat: { id: string; slug: string; nameEn: string; nameBn: string; descriptionEn?: string; descriptionBn?: string }) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group block p-6 bg-industrial-light rounded-xl border-2 border-transparent hover:border-action-orange hover:shadow-lg transition"
              >
                <div className="w-14 h-14 rounded-lg bg-action-orange/10 flex items-center justify-center mb-4 group-hover:bg-action-orange/20 transition">
                  <svg className="w-8 h-8 text-action-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-industrial-dark mb-2 group-hover:text-action-orange transition">
                  {locale === 'bn' ? cat.nameBn : cat.nameEn}
                </h3>
                <p className="text-industrial-silver text-sm">
                  {locale === 'bn' ? cat.descriptionBn : cat.descriptionEn}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <IndustriesSection />

      <TrustedPartners />

      <section className="py-16 bg-industrial-light">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-industrial-dark">
              {t('home.featuredProducts')}
            </h2>
            <Link href="/products" className="text-action-orange font-semibold hover:underline">
              {t('home.viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-action-orange">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t('home.taglineBn')}
          </h2>
          <p className="text-white/90 font-bengali mb-8 max-w-2xl mx-auto">
            {t('home.taglineBn')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-action-orange font-bold py-3 px-8 rounded-lg hover:bg-industrial-light transition"
            >
              {t('products.requestQuote')}
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-industrial-dark text-white font-bold py-3 px-8 rounded-lg hover:bg-industrial-charcoal transition"
            >
              {t('products.inquireWhatsApp')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
