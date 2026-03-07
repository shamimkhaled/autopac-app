'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useLocale } from '@/context/LocaleContext';
import { useProducts, useCategories } from '@/hooks/useSiteData';
import {
  ArrowRight, Camera, ChevronLeft, ChevronRight,
  MessageSquare, ZoomIn, Phone, CheckCircle,
} from 'lucide-react';
import type { Product, Category } from '@/lib/api';
import AdSense from '@/components/News/AdSense';

// 16 per page → two natural batches of 8, with an ad in between
const PAGE_SIZE = 16;
const BATCH_SIZE = 8;

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
    const imgs = Array.isArray(p.images)
      ? p.images.filter((x): x is string => typeof x === 'string')
      : [];
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

/** Full-screen lightbox viewer */
function LightboxModal({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${item.nameEn}`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 border border-white/10 flex items-center justify-center text-white transition-all z-10 touch-manipulation"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 border border-white/10 flex items-center justify-center text-white transition-all z-10 touch-manipulation"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <div
        className="relative max-w-5xl w-full mx-10 sm:mx-16 rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl"
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
        {/* Info + CTA bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] text-action-orange font-black uppercase tracking-widest mb-1">
              {item.categoryNameEn}
            </p>
            <h3 className="text-white font-black text-base sm:text-xl leading-tight line-clamp-2">
              {item.nameEn}
            </h3>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link
              href={`/contact?product=${encodeURIComponent(item.nameEn)}`}
              className="flex items-center gap-2 px-5 sm:px-7 py-3 bg-action-orange text-white font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap shadow-xl shadow-action-orange/30"
              onClick={onClose}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Request Quote
            </Link>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-2xl font-bold transition-colors touch-manipulation active:scale-90"
          aria-label="Close lightbox"
        >
          ×
        </button>
      </div>
    </div>
  );
}

/** Individual gallery card — always-visible CTA on mobile, hover on desktop */
function GalleryCard({
  item,
  featured = false,
  onClick,
}: {
  item: GalleryItem;
  featured?: boolean;
  onClick: () => void;
}) {
  const { locale } = useLocale();
  const name = locale === 'bn' ? item.nameBn : item.nameEn;
  const catName = locale === 'bn' ? item.categoryNameBn : item.categoryNameEn;

  return (
    <div
      className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-black/50 transition-all duration-500 hover:-translate-y-1 ${
        featured ? 'aspect-[4/3]' : 'aspect-square'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.nameEn}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=60&w=400';
        }}
      />

      {/* Gradient overlay — visible on mobile, triggered by hover on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] text-action-orange font-black uppercase tracking-widest leading-none mb-1">
          {catName}
        </p>
        <h3 className="text-white font-black text-xs sm:text-sm leading-tight line-clamp-2 mb-2 sm:mb-3">
          {name}
        </h3>
        <div className="flex gap-2">
          <Link
            href={`/contact?product=${encodeURIComponent(item.nameEn)}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 sm:py-3 bg-action-orange text-white font-black text-[10px] sm:text-xs uppercase tracking-wide rounded-lg hover:bg-orange-600 transition-colors active:scale-95 touch-manipulation"
          >
            <MessageSquare className="w-3 h-3" />
            {locale === 'bn' ? 'কোট' : 'Quote'}
          </Link>
          <button
            className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors touch-manipulation active:scale-90"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            aria-label="Enlarge image"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Horizontal AdSense-ready slot with correct container sizing */
function AdSlot({ slot, label = 'Advertisement' }: { slot: string; label?: string }) {
  return (
    <div className="my-8 sm:my-10" aria-label={label}>
      <AdSense slot={slot} format="auto" />
    </div>
  );
}

/** Mid-page inline CTA strip — high conversion, breaks ad from gallery */
function InlineCTAStrip({ locale }: { locale: string }) {
  return (
    <div className="my-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-action-orange to-orange-600 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl shadow-action-orange/20">
      <div className="text-center sm:text-left">
        <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
          {locale === 'bn' ? 'বিশেষজ্ঞ পরামর্শ' : 'Free Expert Consultation'}
        </p>
        <h3 className="text-white font-black text-xl sm:text-2xl uppercase tracking-tight leading-tight">
          {locale === 'bn' ? 'আজই কোটেশন নিন' : 'Get Your Custom Quote Today'}
        </h3>
        <p className="text-white/70 text-xs sm:text-sm mt-1 font-medium">
          {locale === 'bn'
            ? '২৪ ঘণ্টার মধ্যে আমাদের ইঞ্জিনিয়ার আপনার সাথে যোগাযোগ করবে।'
            : 'Our engineers respond within 24 hours with a tailored proposal.'}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        <Link
          href="/contact"
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-action-orange font-black text-[10px] uppercase tracking-wider rounded-xl hover:bg-orange-50 transition-all shadow-lg active:scale-95 touch-manipulation"
        >
          <MessageSquare className="w-4 h-4" />
          {locale === 'bn' ? 'ফর্ম পূরণ করুন' : 'Request Quotation'}
        </Link>
        <a
          href="https://wa.me/8801818496642"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/20 text-white font-black text-[10px] uppercase tracking-wider rounded-xl hover:bg-white/30 transition-all border border-white/30 active:scale-95 touch-manipulation"
        >
          <Phone className="w-4 h-4" />
          WhatsApp
        </a>
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

  const allItems = useMemo(
    () => buildGalleryItems(products, categories),
    [products, categories]
  );

  const uniqueCats = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.categoryNameEn))).filter(Boolean),
    [allItems]
  );

  const filtered = useMemo(
    () => (activeCat === 'all' ? allItems : allItems.filter((i) => i.categoryNameEn === activeCat)),
    [allItems, activeCat]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Split page into two batches — ad goes between them
  const batchA = pageItems.slice(0, BATCH_SIZE);
  const batchB = pageItems.slice(BATCH_SIZE);

  const handleCatChange = useCallback((cat: string) => {
    setActiveCat(cat);
    setPage(1);
  }, []);

  const lightboxIdx = lightbox
    ? filtered.findIndex(
        (i) =>
          i.imageUrl === lightbox.imageUrl &&
          i.productId === lightbox.productId &&
          i.imageIndex === lightbox.imageIndex
      )
    : -1;
  const goPrev = useCallback(() => {
    if (lightboxIdx > 0) setLightbox(filtered[lightboxIdx - 1]);
  }, [lightboxIdx, filtered]);
  const goNext = useCallback(() => {
    if (lightboxIdx < filtered.length - 1) setLightbox(filtered[lightboxIdx + 1]);
  }, [lightboxIdx, filtered]);

  const isLoaded = productsLoaded && categoriesLoaded;

  const filterTabs = [
    { id: 'all', labelEn: 'All Machines', labelBn: 'সব মেশিন' },
    ...uniqueCats.map((c) => ({ id: c, labelEn: c, labelBn: c })),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">

      {/* Load AdSense script only when publisher ID is configured */}
      {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
        <Script
          id="adsense-gallery"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
        />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 lg:py-28 bg-industrial-dark overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 grayscale bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/images/slider1.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-industrial-dark/60 to-industrial-dark pointer-events-none" aria-hidden="true" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 sm:w-12 h-0.5 bg-action-orange rounded-full" aria-hidden="true" />
            <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
              {locale === 'bn' ? 'মেশিনারি গ্যালারি' : 'Machinery Gallery'}
            </span>
            <div className="w-8 sm:w-12 h-0.5 bg-action-orange rounded-full" aria-hidden="true" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-tight mb-5">
            {locale === 'bn' ? 'আমাদের মেশিন' : 'Industrial'}{' '}
            <span className="text-action-orange">
              {locale === 'bn' ? 'গ্যালারি' : 'Machine Gallery'}
            </span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg font-medium max-w-2xl mx-auto mb-8">
            {locale === 'bn'
              ? 'বিশ্বমানের মেশিনারির ছবি দেখুন এবং আগ্রহের মেশিনে সরাসরি কোটেশন চান।'
              : 'Explore our complete range of food processing, packaging, and industrial machinery. Click any image to request a quotation.'}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-action-orange text-white font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/30 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              {locale === 'bn' ? 'কোটেশন চান' : 'Request a Quotation'}
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 text-white font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-white/20 transition-all border border-white/20 active:scale-95"
            >
              {locale === 'bn' ? 'সব পণ্য দেখুন' : 'View All Products'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
            {[
              locale === 'bn' ? '৫০০+ মেশিন সরবরাহ' : '500+ Machines Delivered',
              locale === 'bn' ? '২৪ ঘণ্টায় সাড়া' : '24-Hour Response',
              locale === 'bn' ? 'বিনামূল্যে পরামর্শ' : 'Free Consultation',
            ].map((s) => (
              <span key={s} className="flex items-center gap-1.5 text-white/50 text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-action-orange flex-shrink-0" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Category filter */}
        <div
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 mb-2 scrollbar-hide"
          role="tablist"
          aria-label="Filter by category"
        >
          {filterTabs.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCat === cat.id}
              onClick={() => handleCatChange(cat.id)}
              className={`flex-shrink-0 px-4 sm:px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all touch-manipulation ${
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
          <div className="flex items-center justify-between mb-4 mt-4">
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
              <Camera className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" aria-hidden="true" />
              {filtered.length} {locale === 'bn' ? 'টি ছবি' : 'images'}
            </p>
            {totalPages > 1 && (
              <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                {locale === 'bn' ? 'পৃষ্ঠা' : 'Page'} {safePage} / {totalPages}
              </p>
            )}
          </div>
        )}

        {/* ── TOP AD SLOT ─────────────────────────────────────────────── */}
        <AdSlot slot="gallery-top-banner" label="Top advertisement" />

        {/* ── Gallery ─────────────────────────────────────────────────── */}
        {!isLoaded ? (
          /* Skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className={`bg-gray-100 dark:bg-slate-800 rounded-2xl sm:rounded-3xl animate-pulse ${
                  i === 0 ? 'aspect-[4/3]' : 'aspect-square'
                }`}
              />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24 bg-gray-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
            <Camera className="w-12 h-12 text-gray-300 dark:text-slate-700 mx-auto mb-4" aria-hidden="true" />
            <p className="font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest text-sm">
              {locale === 'bn' ? 'কোন ছবি পাওয়া যায়নি' : 'No images found'}
            </p>
          </div>
        ) : (
          <>
            {/* Batch A — first 8 items */}
            {batchA.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {batchA.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.imageIndex}`}
                    className={
                      // First item of the page is a "featured" card spanning 2 cols
                      idx === 0 && safePage === 1
                        ? 'col-span-2 sm:col-span-2 lg:col-span-2'
                        : ''
                    }
                  >
                    <GalleryCard
                      item={item}
                      featured={idx === 0 && safePage === 1}
                      onClick={() => setLightbox(item)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── MID AD SLOT + CTA strip ──────────────────────────── */}
            {batchB.length > 0 && (
              <>
                <InlineCTAStrip locale={locale} />
                <AdSlot slot="gallery-mid-banner" label="Mid-page advertisement" />
              </>
            )}

            {/* Batch B — remaining items */}
            {batchB.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {batchB.map((item) => (
                  <GalleryCard
                    key={`${item.productId}-${item.imageIndex}`}
                    item={item}
                    onClick={() => setLightbox(item)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 sm:mt-14">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4" />
              {locale === 'bn' ? 'আগে' : 'Prev'}
            </button>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                .reduce<(number | '…')[]>((acc, n, i, arr) => {
                  if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('…');
                  acc.push(n);
                  return acc;
                }, [])
                .map((pg, i) =>
                  pg === '…' ? (
                    <span key={`e${i}`} className="px-2 text-gray-400 text-xs">…</span>
                  ) : (
                    <button
                      key={pg}
                      onClick={() => setPage(pg as number)}
                      aria-current={safePage === pg ? 'page' : undefined}
                      className={`w-10 h-10 rounded-xl font-black text-xs transition-all touch-manipulation ${
                        safePage === pg
                          ? 'bg-action-orange text-white shadow-lg shadow-action-orange/30'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {pg}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all touch-manipulation"
            >
              {locale === 'bn' ? 'পরে' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── BOTTOM AD SLOT ───────────────────────────────────────────── */}
        <AdSlot slot="gallery-bottom-banner" label="Bottom advertisement" />

        {/* ── Final CTA banner ─────────────────────────────────────────── */}
        <div className="mt-4 mb-8 bg-industrial-dark rounded-3xl sm:rounded-[40px] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-action-orange/10 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-action-orange/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative z-10">
            <p className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-4">
              {locale === 'bn' ? 'বিনামূল্যে কাস্টম কোটেশন' : 'Free Custom Quotation'}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-4">
              {locale === 'bn' ? 'সঠিক মেশিনটি খুঁজে পাচ্ছেন না?' : 'Found the Right'}{' '}
              <span className="text-action-orange">
                {locale === 'bn' ? 'আমাদের সাথে কথা বলুন' : 'Machine?'}
              </span>
            </h2>
            <p className="text-white/60 font-medium max-w-xl mx-auto mb-8 text-sm sm:text-base">
              {locale === 'bn'
                ? 'আমাদের ইঞ্জিনিয়ারিং টিম আপনাকে সঠিক মেশিন বেছে নিতে এবং কাস্টম কোটেশন তৈরি করতে সাহায্য করবে।'
                : 'Our engineering team will prepare a custom proposal and pricing within 24 hours — no obligation.'}
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
                href="https://wa.me/8801818496642"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-white/20 transition-all border border-white/20 active:scale-95"
              >
                <Phone className="w-4 h-4" />
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
