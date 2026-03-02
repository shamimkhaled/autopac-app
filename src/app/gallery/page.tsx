'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import { useProducts, useCategories } from '@/hooks/useSiteData';
import { ArrowRight, Camera, ChevronLeft, ChevronRight, MessageSquare, ZoomIn } from 'lucide-react';
import type { Product, Category } from '@/lib/api';

const PAGE_SIZE = 12;

interface GalleryItem {
  productId: string;
  productSlug: string;
  nameEn: string;
  nameBn: string;
  categoryNameEn: string;
  categoryNameBn: string;
  imageUrl: string;
  imageIndex: number;
}

function buildGalleryItems(products: Product[], categories: Category[]): GalleryItem[] {
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const items: GalleryItem[] = [];
  for (const p of products) {
    const imgs = Array.isArray(p.images) ? p.images.filter((x): x is string => typeof x === 'string') : [];
    if (!imgs.length) continue;
    const cat = catMap[p.categoryId];
    imgs.forEach((url, idx) => {
      items.push({
        productId: p.id,
        productSlug: p.slug,
        nameEn: p.nameEn,
        nameBn: p.nameBn,
        categoryNameEn: cat?.nameEn ?? '',
        categoryNameBn: cat?.nameBn ?? '',
        imageUrl: url,
        imageIndex: idx,
      });
    });
  }
  return items;
}

function LightboxModal({ item, onClose, onPrev, onNext }: {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <div
        className="relative max-w-4xl w-full mx-4 sm:mx-12 rounded-3xl overflow-hidden bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-[4/3] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.nameEn}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-5 sm:p-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] text-action-orange font-black uppercase tracking-widest">{item.categoryNameEn}</p>
            <h3 className="text-white font-black text-base sm:text-xl mt-1">{item.nameEn}</h3>
          </div>
          <Link
            href={`/contact?product=${encodeURIComponent(item.nameEn)}`}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-action-orange text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap flex-shrink-0"
            onClick={onClose}
          >
            Get Quote <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-xl font-bold transition-colors"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { locale } = useLocale();
  const [products, productsLoaded] = useProducts();
  const [categories, categoriesLoaded] = useCategories();
  const [activeCat, setActiveCat] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const allItems = useMemo(() => buildGalleryItems(products, categories), [products, categories]);

  const filtered = useMemo(() =>
    activeCat === 'all' ? allItems : allItems.filter((i) => i.categoryNameEn === activeCat),
    [allItems, activeCat]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleCatChange = useCallback((cat: string) => {
    setActiveCat(cat);
    setPage(1);
  }, []);

  const lightboxIdx = lightbox ? filtered.findIndex((i) => i.imageUrl === lightbox.imageUrl && i.productId === lightbox.productId && i.imageIndex === lightbox.imageIndex) : -1;
  const goPrev = useCallback(() => { if (lightboxIdx > 0) setLightbox(filtered[lightboxIdx - 1]); }, [lightboxIdx, filtered]);
  const goNext = useCallback(() => { if (lightboxIdx < filtered.length - 1) setLightbox(filtered[lightboxIdx + 1]); }, [lightboxIdx, filtered]);

  const isLoaded = productsLoaded && categoriesLoaded;

  const uniqueCats = useMemo(() => Array.from(new Set(allItems.map((i) => i.categoryNameEn))), [allItems]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 lg:py-32 bg-industrial-dark overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 grayscale bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/images/slider1.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-industrial-dark/60 to-industrial-dark pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 sm:w-12 h-0.5 bg-action-orange rounded-full" aria-hidden="true" />
            <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
              {locale === 'bn' ? 'মেশিনারি গ্যালারি' : 'Machinery Gallery'}
            </span>
            <div className="w-8 sm:w-12 h-0.5 bg-action-orange rounded-full" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-tight mb-5">
            {locale === 'bn' ? 'আমাদের মেশিন' : 'Our'}{' '}
            <span className="text-action-orange">{locale === 'bn' ? 'গ্যালারি' : 'Machine Gallery'}</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg font-medium max-w-2xl mx-auto mb-8">
            {locale === 'bn'
              ? 'বিশ্বমানের মেশিনারির ছবি দেখুন এবং আগ্রহের মেশিনে সরাসরি কোটেশন চান।'
              : 'Explore high-quality imagery of our complete industrial machinery range. Click any machine to request a quotation.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-action-orange text-white font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/30 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              {locale === 'bn' ? 'কোটেশন চান' : 'Request a Quotation'}
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-white/20 transition-all border border-white/20 active:scale-95"
            >
              {locale === 'bn' ? 'সব পণ্য দেখুন' : 'View All Products'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 mb-8 sm:mb-10 scrollbar-hide" role="tablist" aria-label="Filter by category">
          {[{ id: 'all', labelEn: 'All Machines', labelBn: 'সব মেশিন' }, ...uniqueCats.map((c) => ({ id: c, labelEn: c, labelBn: c }))].map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCat === cat.id}
              onClick={() => handleCatChange(cat.id)}
              className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all touch-manipulation ${
                activeCat === cat.id
                  ? 'bg-action-orange text-white shadow-lg shadow-action-orange/30'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {locale === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        {isLoaded && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
              <Camera className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
              {filtered.length} {locale === 'bn' ? 'টি ছবি' : 'images'}
            </p>
            {totalPages > 1 && (
              <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                {locale === 'bn' ? 'পৃষ্ঠা' : 'Page'} {safePage} / {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl sm:rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
            <Camera className="w-12 h-12 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest text-sm">
              {locale === 'bn' ? 'কোন ছবি পাওয়া যায়নি' : 'No images found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {pageItems.map((item) => (
              <div
                key={`${item.productId}-${item.imageIndex}`}
                className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-1"
                onClick={() => setLightbox(item)}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.nameEn}`}
                onKeyDown={(e) => e.key === 'Enter' && setLightbox(item)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={locale === 'bn' ? item.nameBn : item.nameEn}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=60&w=400';
                  }}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                  <p className="text-[9px] sm:text-[10px] text-action-orange font-black uppercase tracking-widest leading-none mb-1">
                    {locale === 'bn' ? item.categoryNameBn : item.categoryNameEn}
                  </p>
                  <h3 className="text-white font-black text-xs sm:text-sm leading-tight line-clamp-2 mb-2 sm:mb-3">
                    {locale === 'bn' ? item.nameBn : item.nameEn}
                  </h3>
                  <div className="flex gap-2">
                    <Link
                      href={`/contact?product=${encodeURIComponent(item.nameEn)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 bg-action-orange text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wide rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Quote
                    </Link>
                    <button
                      className="flex items-center justify-center w-8 sm:w-9 h-[30px] sm:h-[34px] bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                      onClick={(e) => { e.stopPropagation(); setLightbox(item); }}
                      aria-label="Enlarge"
                    >
                      <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 sm:mt-14">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                .reduce<(number | '…')[]>((acc, n, i, arr) => {
                  if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('…');
                  acc.push(n);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === '…' ? (
                    <span key={`e${i}`} className="px-2 text-gray-400 text-xs">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      aria-current={safePage === item ? 'page' : undefined}
                      className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${
                        safePage === item
                          ? 'bg-action-orange text-white shadow-lg shadow-action-orange/30'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-14 sm:mt-20 bg-industrial-dark rounded-3xl sm:rounded-[40px] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-action-orange/10 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-4">
              {locale === 'bn' ? 'আগ্রহী মেশিনের' : 'Interested in a'}{' '}
              <span className="text-action-orange">{locale === 'bn' ? 'কোটেশন চান?' : 'Machine?'}</span>
            </h2>
            <p className="text-white/60 font-medium max-w-xl mx-auto mb-8 text-sm sm:text-base">
              {locale === 'bn'
                ? 'আমাদের ইঞ্জিনিয়ারিং টিম আপনাকে সঠিক মেশিন বেছে নিতে এবং কাস্টম কোটেশন তৈরি করতে সাহায্য করবে।'
                : 'Our engineering team will help you select the right machine and prepare a custom quotation within 24 hours.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-action-orange text-white font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/30 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                {locale === 'bn' ? 'কোটেশন চান' : 'Request a Quotation'}
              </Link>
              <a
                href={`https://wa.me/8801818496642`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-white/20 transition-all border border-white/20 active:scale-95"
              >
                {locale === 'bn' ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <LightboxModal
          item={lightbox}
          onClose={() => setLightbox(null)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}
