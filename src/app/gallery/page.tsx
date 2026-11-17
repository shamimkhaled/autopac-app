'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { useProducts, useCategories, useCompany } from '@/hooks/useSiteData';
import {
  ArrowRight,
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  Film,
  FileText,
  MessageSquare,
  Phone,
  Search,
  X,
  ZoomIn,
} from 'lucide-react';
import type { Product, Category } from '@/lib/api';
import { brochurePageSrc } from '@/data/brochure';
import PageHero from '@/components/PageHero';
import QuoteBand from '@/components/QuoteBand';
import VideoShowcaseSection from '@/components/VideoShowcaseSection';

const PAGE_SIZE = 12;

type GalleryMode = 'photos' | 'videos' | 'sheets';

interface GalleryItem {
  productId: string;
  productSlug: string;
  modelCode?: string;
  brochurePage?: number;
  nameEn: string;
  nameBn: string;
  shortDescEn: string;
  shortDescBn: string;
  keySpec?: string;
  categoryNameEn: string;
  categoryNameBn: string;
  imageUrl: string;
  imageIndex: number;
}

const KEY_BROCHURE_SHEETS = [
  { page: 2, titleEn: 'Auto Pac Overview: Food, Cosmetics & Beverage Lines', titleBn: 'অটো প্যাক ওভারভিউ: ফুড, কসমেটিক্স ও বেভারেজ' },
  { page: 23, titleEn: 'AP 110-M to AP 160-M VFFS & Liquid Sachet Series', titleBn: 'AP 110-M থেকে AP 160-M পাউচ ও স্যাশেট সিরিজ' },
  { page: 6, titleEn: 'Atta/Maida Auger, AP-450M, AP-350M, Flow Wrap & Weight Filling', titleBn: 'আটা-ময়দা অগার, AP-450M, AP-350M ও ওয়েট ফিলিং' },
  { page: 7, titleEn: 'Hand Wash, Dish Wash, Harpic Mixer & Foot/Induction Sealer', titleBn: 'হ্যান্ড ওয়াশ, ডিশ ওয়াশ, হারপিক মিক্সার ও সিলার' },
  { page: 8, titleEn: 'Water, Juice & Beverage Bottle Washing, Filling & Capping', titleBn: 'পানি, জুস ও বেভারেজ বোতল ওয়াশিং, ফিলিং ও ক্যাপিং' },
  { page: 9, titleEn: 'CIP Plant Rotary Washing, Chemical Tanks & Milk Pasteurizer', titleBn: 'সিআইপি প্ল্যান্ট, কেমিক্যাল ট্যাংক ও মিল্ক পাস্তুরাইজার' },
  { page: 21, titleEn: 'Chocolate Line, Collar Auger, Date Coder, FRD-1000w & Shrink Tunnel', titleBn: 'চকোলেট, কলার অগার, ডেট কোডার, FRD-1000w ও শ্রিঙ্ক' },
  { page: 24, titleEn: 'AP-1001M/1002M Band Sealers, AP-500M & DZ-260 Vacuum Sealer', titleBn: 'ব্যান্ড সিলার, AP-500M ও ভ্যাকুয়াম সিলিং মেশিন' },
  { page: 42, titleEn: 'Digital Liquid Filling (2-Nozzle), 4-6 Head & Semi-Auto Capper', titleBn: 'ডিজিটাল লিকুইড ফিলিং ও সেমি-অটো বোতল ক্যাপিং' },
];

function buildGalleryItems(products: Product[], categories: Category[]): GalleryItem[] {
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const items: GalleryItem[] = [];
  for (const p of products) {
    const imgs = Array.isArray(p.images)
      ? p.images.filter((x): x is string => typeof x === 'string')
      : [];
    if (!imgs.length) continue;
    const cat = catMap[p.categoryId] ?? p.category;
    const firstSpec = Array.isArray(p.specs) && p.specs[0]
      ? `${p.specs[0].value}${p.specs[0].unit ? ` ${p.specs[0].unit}` : ''}`
      : undefined;
    imgs.forEach((url, idx) => {
      items.push({
        productId: p.id,
        productSlug: p.slug,
        modelCode: p.modelCode,
        brochurePage: p.brochurePage,
        nameEn: p.nameEn,
        nameBn: p.nameBn,
        shortDescEn: p.shortDescEn,
        shortDescBn: p.shortDescBn,
        keySpec: firstSpec,
        categoryNameEn: cat?.nameEn ?? 'Machinery',
        categoryNameBn: cat?.nameBn ?? 'মেশিনারি',
        imageUrl: url,
        imageIndex: idx,
      });
    });
  }
  return items;
}

function LightboxModal({
  item,
  locale,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  item: GalleryItem;
  locale: 'en' | 'bn';
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const isBn = locale === 'bn';
  const name = isBn ? item.nameBn : item.nameEn;
  const desc = isBn ? item.shortDescBn : item.shortDescEn;
  const cat = isBn ? item.categoryNameBn : item.categoryNameEn;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/92 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-md bg-white/15 hover:bg-white/25 border border-white/15 flex items-center justify-center text-white transition-colors z-10"
          aria-label="Previous machine"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-md bg-white/15 hover:bg-white/25 border border-white/15 flex items-center justify-center text-white transition-colors z-10"
          aria-label="Next machine"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div
        className="relative max-w-4xl w-full mx-8 sm:mx-16 rounded-md overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-[16/10] bg-white relative border-b border-stone-200 dark:border-stone-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={name}
            className="w-full h-full object-contain p-4 sm:p-6"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-11 h-11 rounded-md bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-maroon">
              {cat}
              {item.modelCode ? ` · ${item.modelCode}` : ''}
              {item.keySpec ? ` · ${item.keySpec}` : ''}
            </p>
            <h3 className="mt-1 text-lg sm:text-xl font-semibold text-stone-900 dark:text-white leading-snug">
              {name}
            </h3>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
              {desc}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href={`/products/${item.productSlug}`}
              onClick={onClose}
              className="btn-secondary text-[13px] whitespace-nowrap"
            >
              {isBn ? 'বিস্তারিত' : 'Machine Specs'}
            </Link>
            {item.brochurePage && (
              <Link
                href={`/brochure?page=${item.brochurePage}`}
                onClick={onClose}
                className="btn-secondary text-[13px] whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                {isBn ? `শিট ${item.brochurePage}` : `Sheet p.${item.brochurePage}`}
              </Link>
            )}
            <Link
              href={`/contact?product=${encodeURIComponent(name)}`}
              onClick={onClose}
              className="btn-primary text-[13px] whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              {isBn ? 'কোটেশন চান' : 'Request Quote'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  const { locale } = useLocale();
  const isBn = locale === 'bn';
  const name = isBn ? item.nameBn : item.nameEn;
  const catName = isBn ? item.categoryNameBn : item.categoryNameEn;

  return (
    <article className="surface-card surface-card-hover overflow-hidden flex flex-col h-full group">
      <button
        type="button"
        onClick={onClick}
        className="relative aspect-[4/3] w-full bg-white border-b border-stone-200 dark:border-stone-800 overflow-hidden cursor-zoom-in text-left"
        aria-label={`Enlarge ${name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/machines/ap-110m-granule.webp';
          }}
        />
        <span className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-md bg-stone-900/75 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4" />
        </span>
      </button>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-maroon truncate">
          {catName}
          {item.modelCode ? ` · ${item.modelCode}` : ''}
        </p>
        <h3 className="mt-1 text-sm sm:text-base font-semibold text-stone-900 dark:text-white leading-snug line-clamp-2">
          {name}
        </h3>
        {item.keySpec && (
          <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400 truncate">
            {item.keySpec}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center gap-2">
          <Link
            href={`/products/${item.productSlug}`}
            className="btn-secondary flex-1 min-h-[40px] py-1.5 px-3 text-xs whitespace-nowrap"
          >
            {isBn ? 'স্পেস' : 'Specs'}
          </Link>
          {item.brochurePage && (
            <Link
              href={`/brochure?page=${item.brochurePage}`}
              className="inline-flex items-center justify-center min-h-[40px] px-2.5 border border-stone-300 dark:border-stone-700 rounded-md text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-brand-maroon hover:text-brand-maroon shrink-0"
              title={isBn ? `ক্যাটালগ পৃষ্ঠা ${item.brochurePage}` : `Catalog sheet p.${item.brochurePage}`}
            >
              p.{item.brochurePage}
            </Link>
          )}
          <Link
            href={`/contact?product=${encodeURIComponent(name)}`}
            className="btn-primary flex-1 min-h-[40px] py-1.5 px-3 text-xs whitespace-nowrap"
          >
            {isBn ? 'কোট' : 'Quote'}
          </Link>
        </div>
      </div>
    </article>
  );
}

function GalleryPageContent() {
  const { locale } = useLocale();
  const isBn = locale === 'bn';
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const initialMode: GalleryMode =
    tabParam === 'videos' ? 'videos' : tabParam === 'sheets' ? 'sheets' : 'photos';

  const [mode, setMode] = useState<GalleryMode>(initialMode);
  const [products, productsLoaded] = useProducts();
  const [categories, categoriesLoaded] = useCategories();
  const [company] = useCompany();
  const whatsappNumber = company?.whatsapp || '8801818496642';
  const [activeCat, setActiveCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (tabParam === 'videos') setMode('videos');
    else if (tabParam === 'sheets') setMode('sheets');
    else if (tabParam === 'photos') setMode('photos');
  }, [tabParam]);

  const switchMode = (nextMode: GalleryMode) => {
    setMode(nextMode);
    router.replace(nextMode === 'photos' ? '/gallery' : `/gallery?tab=${nextMode}`, {
      scroll: false,
    });
  };

  const allItems = useMemo(
    () => buildGalleryItems(products, categories),
    [products, categories]
  );

  const uniqueCats = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.categoryNameEn))).filter(Boolean),
    [allItems]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allItems.filter((item) => {
      if (activeCat !== 'all' && item.categoryNameEn !== activeCat) return false;
      if (!q) return true;
      return (
        item.nameEn.toLowerCase().includes(q) ||
        item.nameBn.includes(q) ||
        (item.modelCode?.toLowerCase().includes(q) ?? false) ||
        item.shortDescEn.toLowerCase().includes(q)
      );
    });
  }, [allItems, activeCat, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
    if (lightboxIdx >= 0 && lightboxIdx < filtered.length - 1) {
      setLightbox(filtered[lightboxIdx + 1]);
    }
  }, [lightboxIdx, filtered]);

  const isLoaded = productsLoaded && categoriesLoaded;

  const filterTabs = [
    { id: 'all', labelEn: 'All Machines', labelBn: 'সব মেশিন' },
    ...uniqueCats.map((c) => {
      const match = categories.find((cat) => cat.nameEn === c);
      return { id: c, labelEn: c, labelBn: match?.nameBn || c };
    }),
  ];

  return (
    <div className="page-shell">
      <PageHero
        kicker={isBn ? 'মেশিনারি প্রদর্শনী ও ভিডিও' : 'Machinery gallery & video showcase'}
        title={
          isBn
            ? 'অটো প্যাক মেশিনের ছবি, ভিডিও ও ক্যাটালগ শিট'
            : 'Machine photos, operation videos & catalog sheets'
        }
        description={
          isBn
            ? 'ক্যাটালগ পিডিএফ থেকে প্রতিটি মেশিনের পরিষ্কার ছবি, কাজের ধাপের ভিডিও ও মূল ব্রোশিওর শিট একসাথে দেখুন।'
            : 'Inspect individual machine photos built from the official PDF sheets, watch step-by-step operation reels, or open full catalog pages.'
        }
        actions={
          <>
            <Link href="/products" className="btn-primary whitespace-nowrap">
              {isBn ? 'সব মেশিন দেখুন' : 'All machinery'}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href="/brochure" className="btn-secondary whitespace-nowrap">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              {isBn ? '১২২-পৃষ্ঠার ব্রোশিওর' : '122-page flipbook'}
            </Link>
          </>
        }
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div className="inline-flex flex-wrap gap-2" role="tablist" aria-label={isBn ? 'ভিউ মোড' : 'Gallery view mode'}>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'photos'}
              onClick={() => switchMode('photos')}
              className={`filter-chip inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
                mode === 'photos' ? 'filter-chip-active' : ''
              }`}
            >
              <Camera className="w-4 h-4" />
              {isBn ? `মেশিন ছবি (${allItems.length})` : `Machine Photos (${allItems.length})`}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'videos'}
              onClick={() => switchMode('videos')}
              className={`filter-chip inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
                mode === 'videos' ? 'filter-chip-active' : ''
              }`}
            >
              <Film className="w-4 h-4" />
              {isBn ? 'ভিডিও শোকেস (৬)' : 'Video Showcase (6)'}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'sheets'}
              onClick={() => switchMode('sheets')}
              className={`filter-chip inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
                mode === 'sheets' ? 'filter-chip-active' : ''
              }`}
            >
              <FileText className="w-4 h-4" />
              {isBn ? 'মূল ক্যাটালগ শিট (৯)' : 'Brochure Sheets (9)'}
            </button>
          </div>

          {mode === 'photos' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={isBn ? 'মডেল বা মেশিন খুঁজুন (AP 110-M...)' : 'Filter model or machine...'}
                className="input-field pl-9 pr-8 h-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label="Clear filter"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* MODE 1: Machine Photos */}
        {mode === 'photos' && (
          <div className="mt-6 space-y-6">
            <div
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
              role="tablist"
              aria-label="Filter by category"
            >
              {filterTabs.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCat === cat.id}
                  onClick={() => handleCatChange(cat.id)}
                  className={`filter-chip whitespace-nowrap shrink-0 ${
                    activeCat === cat.id ? 'filter-chip-active' : ''
                  }`}
                >
                  {isBn ? cat.labelBn : cat.labelEn}
                </button>
              ))}
            </div>

            {isLoaded && (
              <div className="flex items-center justify-between text-xs font-medium text-stone-500 uppercase tracking-wider">
                <span>
                  {filtered.length} {isBn ? 'টি মেশিনের ছবি' : 'machine photos'}
                </span>
                {totalPages > 1 && (
                  <span>
                    {isBn ? 'পৃষ্ঠা' : 'Page'} {safePage} / {totalPages}
                  </span>
                )}
              </div>
            )}

            {!isLoaded ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] bg-stone-100 dark:bg-stone-800 rounded-md border border-stone-200 dark:border-stone-800"
                  />
                ))}
              </div>
            ) : pageItems.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-md border border-stone-200 dark:border-stone-800">
                <Camera className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                <p className="font-medium text-stone-600 dark:text-stone-400 text-sm">
                  {isBn ? 'এই ফিল্টারে কোনো মেশিন পাওয়া যায়নি' : 'No machines match that filter'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCat('all');
                    setSearchQuery('');
                  }}
                  className="btn-secondary mt-4 text-xs"
                >
                  {isBn ? 'সব দেখান' : 'Reset filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {pageItems.map((item) => (
                  <GalleryCard
                    key={`${item.productId}-${item.imageIndex}`}
                    item={item}
                    onClick={() => setLightbox(item)}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="btn-secondary disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {isBn ? 'আগে' : 'Prev'}
                </button>
                <span className="px-3 text-sm font-medium text-stone-600 dark:text-stone-300 tabular-nums">
                  {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="btn-secondary disabled:opacity-40"
                >
                  {isBn ? 'পরে' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Video Showcase */}
        {mode === 'videos' && (
          <div className="mt-6">
            <VideoShowcaseSection />
          </div>
        )}

        {/* MODE 3: Key PDF Brochure Sheets */}
        {mode === 'sheets' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {isBn
                  ? 'মূল ব্রোশিওর পিডিএফের গুরুত্বপূর্ণ মেশিনারি শিট — ক্লিক করে বড় করে দেখুন বা ফ্লিপবুকে খুলুন।'
                  : 'Original brochure catalog sheets from the owner PDF. Click any sheet to open it inside the interactive flipbook.'}
              </p>
              <Link href="/brochure" className="btn-primary text-xs whitespace-nowrap shrink-0">
                <BookOpen className="w-4 h-4" />
                {isBn ? 'সব ১২২ পৃষ্ঠা খুলুন' : 'Open all 122 pages'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {KEY_BROCHURE_SHEETS.map((sheet) => (
                <Link
                  key={sheet.page}
                  href={`/brochure?page=${sheet.page}`}
                  className="surface-card surface-card-hover overflow-hidden flex flex-col group"
                >
                  <div className="relative aspect-[816/1056] bg-white border-b border-stone-200 dark:border-stone-800 overflow-hidden">
                    <Image
                      src={brochurePageSrc(sheet.page)}
                      alt={isBn ? sheet.titleBn : sheet.titleEn}
                      fill
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-maroon">
                      {isBn ? `ক্যাটালগ পৃষ্ঠা ${sheet.page}` : `Catalog Page ${sheet.page}`}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-stone-900 dark:text-white leading-snug">
                      {isBn ? sheet.titleBn : sheet.titleEn}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick WhatsApp / Quotation Strip */}
        <div className="mt-12 bg-brand-maroon text-white rounded-md p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <p className="text-white/80 text-[11px] font-semibold uppercase tracking-[0.16em] mb-1">
              {isBn ? 'সরাসরি পরামর্শ ও মূল্য' : 'Direct Engineering Support'}
            </p>
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              {isBn
                ? 'আপনার পণ্যের উপযোগী মেশিনের কোটেশন নিন'
                : 'Need pricing or video demo on a specific model?'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/contact" className="btn-primary bg-white text-brand-maroon hover:bg-stone-100 whitespace-nowrap">
              {isBn ? 'কোটেশন ফর্ম' : 'Request Quotation'}
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 border border-white/40 text-white text-sm font-semibold rounded-md hover:bg-white/10 whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              WhatsApp · {company?.phone?.split(',')[0]?.trim() || '01818-496642'}
            </a>
          </div>
        </div>
      </div>

      <QuoteBand
        title={isBn ? 'সঠিক মেশিনটি খুঁজে পেয়েছেন?' : 'Found the right machine?'}
        description={
          isBn
            ? 'মেশিনের মডেল লিখে কোটেশন চান। আমরা স্পেসিফিকেশন ও মূল্য নিয়ে যোগাযোগ করব।'
            : 'Quote the model you viewed. We reply with specifications, capacity options, and pricing.'
        }
      />

      {lightbox && (
        <LightboxModal
          item={lightbox}
          locale={isBn ? 'bn' : 'en'}
          onClose={() => setLightbox(null)}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={lightboxIdx > 0}
          hasNext={lightboxIdx >= 0 && lightboxIdx < filtered.length - 1}
        />
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-paper">
          <div className="w-10 h-10 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GalleryPageContent />
    </Suspense>
  );
}
