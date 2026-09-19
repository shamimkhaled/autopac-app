'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useLocale } from '@/context/LocaleContext';
import { useProducts, useCategories } from '@/hooks/useSiteData';
import {
  ArrowRight, Camera, ChevronLeft, ChevronRight,
  MessageSquare, ZoomIn, Phone,
} from 'lucide-react';
import type { Product, Category } from '@/lib/api';
import PageHero from '@/components/PageHero';
import QuoteBand from '@/components/QuoteBand';
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
        className="relative max-w-5xl w-full mx-10 sm:mx-16 overflow-hidden bg-stone-950 border border-stone-800"
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
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-[0.16em] mb-1">
              {item.categoryNameEn}
            </p>
            <h3 className="text-white font-semibold text-base sm:text-xl leading-tight line-clamp-2">
              {item.nameEn}
            </h3>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link
              href={`/contact?product=${encodeURIComponent(item.nameEn)}`}
              className="flex items-center gap-2 px-5 py-3 bg-brand-maroon text-white text-sm font-semibold rounded-md hover:bg-brand-maroon-hover whitespace-nowrap"
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
      className={`group relative rounded-md overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer border border-stone-200 dark:border-stone-800 ${
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
          (e.currentTarget as HTMLImageElement).src = '/images/slider1.png';
        }}
      />

      {/* Gradient overlay — visible on mobile, triggered by hover on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
        <p className="text-[10px] text-white/80 font-medium uppercase tracking-[0.14em] leading-none mb-1">
          {catName}
        </p>
        <h3 className="text-white font-semibold text-xs sm:text-sm leading-tight line-clamp-2 mb-2 sm:mb-3">
          {name}
        </h3>
        <div className="flex gap-2">
          <Link
            href={`/contact?product=${encodeURIComponent(item.nameEn)}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-brand-maroon text-white text-[12px] font-semibold rounded-md"
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
    <div className="my-8 bg-brand-maroon text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
      <div className="text-center sm:text-left">
        <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.16em] mb-1">
          {locale === 'bn' ? 'কোটেশন' : 'Request a quote'}
        </p>
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          {locale === 'bn' ? 'আগ্রহের মেশিনটি কোট করুন' : 'Quote the machine you just viewed'}
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        <Link href="/contact" className="btn-primary bg-white text-brand-maroon hover:bg-stone-100">
          {locale === 'bn' ? 'কোটেশন ফর্ম' : 'Request quotation'}
        </Link>
        <a
          href="https://wa.me/8801818496642"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 border border-white/40 text-white text-sm font-semibold rounded-md"
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
    <div className="page-shell">
      {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
        <Script
          id="adsense-gallery"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
        />
      )}

      <PageHero
        kicker={locale === 'bn' ? 'মেশিনারি গ্যালারি' : 'Machinery gallery'}
        title={locale === 'bn' ? 'ফ্যাক্টরি মেশিনের ছবি' : 'See the machines as installed'}
        description={
          locale === 'bn'
            ? 'ছবি খুলে প্রিভিউ করুন, তারপর সেই মেশিনের জন্য কোটেশন চান।'
            : 'Open any image for a closer look, then request a quote for that machine.'
        }
        actions={
          <>
            <Link href="/products" className="btn-primary">
              {locale === 'bn' ? 'মেশিনারি দেখুন' : 'Browse machinery'}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn-secondary">
              {locale === 'bn' ? 'কোটেশন চান' : 'Request a quote'}
            </Link>
          </>
        }
      />

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
              className={`filter-chip ${
                activeCat === cat.id ? 'filter-chip-active' : ''
              }`}
            >
              {locale === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        {isLoaded && (
          <div className="flex items-center justify-between mb-4 mt-4">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" aria-hidden="true" />
              {filtered.length} {locale === 'bn' ? 'টি ছবি' : 'images'}
            </p>
            {totalPages > 1 && (
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
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
                className={`bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse ${
                  i === 0 ? 'aspect-[4/3]' : 'aspect-square'
                }`}
              />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-md border border-dashed border-stone-300 dark:border-stone-700">
            <Camera className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-4" aria-hidden="true" />
            <p className="font-medium text-stone-500 text-sm">
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
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
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
                      className={`w-10 h-10 rounded-md text-sm font-semibold ${
                        safePage === pg
                          ? 'bg-brand-maroon text-white'
                          : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-brand-maroon'
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
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {locale === 'bn' ? 'পরে' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── BOTTOM AD SLOT ───────────────────────────────────────────── */}
        <AdSlot slot="gallery-bottom-banner" label="Bottom advertisement" />
      </div>

      <QuoteBand
        title={locale === 'bn' ? 'সঠিক মেশিনটি খুঁজে পেয়েছেন?' : 'Found the right machine?'}
        description={
          locale === 'bn'
            ? 'মেশিনের নাম লিখে কোটেশন চান। আমরা স্পেসিফিকেশন ও মূল্য নিয়ে যোগাযোগ করব।'
            : 'Quote the machine you viewed. We reply with specifications and pricing.'
        }
      />

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
