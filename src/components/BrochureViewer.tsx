'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import {
  BROCHURE_LINES,
  BROCHURE_PAGE_COUNT,
  BROCHURE_SECTIONS,
  brochurePageSrc,
  brochureThumbSrc,
  clampBrochurePage,
  lineForPage,
  pageTitle,
  productSlugsForLine,
  type BrochureLine,
} from '@/data/brochure';
import { useCatalogMap } from '@/hooks/useSiteData';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
  MessageSquare,
  X,
} from 'lucide-react';

function quoteHref(page: number, title: string) {
  const interest = `${title} (catalog page ${page})`;
  return `/contact?product=${encodeURIComponent(interest)}`;
}

export default function BrochureViewer() {
  const { locale } = useLocale();
  const isBn = locale === 'bn';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [catalogMap] = useCatalogMap();
  const stripRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const initialPage = clampBrochurePage(Number(searchParams.get('page') || 1));
  const lineParam = searchParams.get('line');
  const lineFromQuery = BROCHURE_LINES.find((l) => l.id === lineParam);

  const [page, setPage] = useState(lineFromQuery ? lineFromQuery.startPage : initialPage);
  const [fullscreen, setFullscreen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const title = pageTitle(page, isBn ? 'bn' : 'en');
  const activeLine = lineForPage(page);
  const matchingCount = activeLine ? productSlugsForLine(activeLine.id, catalogMap).length : 0;
  const section = BROCHURE_SECTIONS.find((s) => page >= s.startPage && page <= s.endPage);

  const syncUrl = useCallback(
    (nextPage: number, lineId?: string) => {
      const params = new URLSearchParams();
      params.set('page', String(nextPage));
      if (lineId) params.set('line', lineId);
      router.replace(`/brochure?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const goTo = useCallback(
    (next: number, lineId?: string) => {
      const clamped = clampBrochurePage(next);
      setImgLoaded(false);
      setPage(clamped);
      syncUrl(clamped, lineId);
    },
    [syncUrl]
  );

  const goLine = (line: BrochureLine) => goTo(line.startPage, line.id);
  const prev = () => goTo(page - 1, activeLine?.id);
  const next = () => goTo(page + 1, activeLine?.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(page - 1, activeLine?.id);
      if (e.key === 'ArrowRight') goTo(page + 1, activeLine?.id);
      if (e.key === 'Escape') setFullscreen(false);
      if (e.key === 'Home') goTo(1);
      if (e.key === 'End') goTo(BROCHURE_PAGE_COUNT);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page, activeLine?.id, goTo]);

  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-page="${page}"]`);
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [page]);

  const preload = useMemo(() => {
    const around = [page - 1, page + 1].filter((p) => p >= 1 && p <= BROCHURE_PAGE_COUNT);
    return around;
  }, [page]);

  return (
    <div className="page-shell text-stone-900">
      {preload.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={p} src={brochurePageSrc(p)} alt="" className="hidden" />
      ))}

      <header className="border-b border-brand-maroon-hover bg-brand-maroon text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 mb-2">
            {isBn ? 'অফিসিয়াল মেশিনারি ক্যাটালগ' : 'Official machinery catalog'}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
                {isBn ? 'অটো প্যাক ব্রোশিওর প্রিভিউ' : 'Auto Pac brochure preview'}
              </h1>
              <p className="mt-2 text-sm text-white/80 max-w-2xl">
                {isBn
                  ? 'মালিকের মূল পিডিএফ — ১২২ পৃষ্ঠা, একই শিট, একই মেশিন। পৃষ্ঠা উল্টান, লাইন বেছে নিন, কোট চান।'
                  : 'The owner’s original 122-page PDF, shown sheet-for-sheet. Flip pages, jump by product line, request a quote for the machine you see.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={quoteHref(page, title)}
                className="btn-primary bg-white text-brand-maroon hover:bg-stone-100"
              >
                <MessageSquare className="w-4 h-4" />
                {isBn ? 'এই পৃষ্ঠার কোট' : 'Quote this page'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
          <FileText className="w-3.5 h-3.5" />
          <span>
            {isBn ? 'পৃষ্ঠা' : 'Page'} {page} / {BROCHURE_PAGE_COUNT}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-slate-900">{title}</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {BROCHURE_LINES.map((line) => {
            const active = activeLine?.id === line.id;
            return (
              <button
                key={line.id}
                type="button"
                onClick={() => goLine(line)}
                className={`flex-shrink-0 min-h-[40px] px-3 py-2 text-left text-[11px] font-semibold border transition-colors ${
                  active
                    ? 'bg-brand-maroon text-white border-brand-maroon'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-brand-maroon'
                }`}
              >
                <span className="block text-[10px] opacity-70">{line.number}</span>
                {isBn ? line.shortBn : line.shortEn}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">
          <aside className="hidden lg:block sticky top-24 space-y-1 max-h-[70vh] overflow-y-auto border border-slate-300 bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-2">
              {isBn ? 'বিষয়সূচি' : 'Contents'}
            </p>
            {BROCHURE_SECTIONS.map((s) => {
              const on = section?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(s.startPage)}
                  className={`w-full text-left px-2 py-2 text-xs ${
                    on ? 'bg-brand-maroon text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-semibold">{isBn ? s.titleBn : s.titleEn}</span>
                  <span className={`text-[10px] ${on ? 'text-white/70' : 'text-slate-400'}`}>
                    {isBn ? 'পৃষ্ঠা' : 'pp.'} {s.startPage}–{s.endPage}
                  </span>
                </button>
              );
            })}
          </aside>

          <div>
            <div
              className="relative bg-white border border-slate-400 mx-auto max-w-[820px]"
              onTouchStart={(e) => {
                touchX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (touchX.current == null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 48) dx < 0 ? next() : prev();
                touchX.current = null;
              }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                <span>Auto Pac · {isBn ? 'বিশ্বমানের মেশিনারি' : 'World class machineries'}</span>
                <span>
                  {page} / {BROCHURE_PAGE_COUNT}
                </span>
              </div>

              <div className="relative bg-slate-200 aspect-[612/792]">
                {!imgLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-slate-200" aria-hidden="true" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brochurePageSrc(page)}
                  alt={title}
                  width={816}
                  height={1056}
                  className={`w-full h-full object-contain bg-white ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                />
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-3 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={prev}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 min-h-[44px] px-3 text-sm font-semibold disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {isBn ? 'আগে' : 'Prev'}
                </button>
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor="brochure-page">
                    {isBn ? 'পৃষ্ঠা নম্বর' : 'Page number'}
                  </label>
                  <input
                    id="brochure-page"
                    type="number"
                    min={1}
                    max={BROCHURE_PAGE_COUNT}
                    value={page}
                    onChange={(e) => goTo(Number(e.target.value))}
                    className="w-16 h-10 text-center border border-slate-300 text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setFullscreen(true)}
                    className="min-h-[44px] px-3 text-sm font-semibold"
                    aria-label={isBn ? 'পূর্ণ স্ক্রিন' : 'Fullscreen'}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={next}
                  disabled={page >= BROCHURE_PAGE_COUNT}
                  className="inline-flex items-center gap-1 min-h-[44px] px-3 text-sm font-semibold disabled:opacity-30"
                >
                  {isBn ? 'পরে' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {activeLine && (
              <div className="mt-4 max-w-[820px] mx-auto border border-slate-300 bg-white p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon mb-1">
                    {isBn ? 'এই মেশিনে যা প্যাক হয়' : 'What this line packs'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeLine.packables.map((item) => (
                      <span key={item} className="px-2 py-1 text-xs border border-slate-300 bg-slate-50">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {matchingCount > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon mb-2">
                      {isBn ? 'মিল মেশিন' : 'Matching machines'}
                    </p>
                    <Link
                      href={`/products?line=${activeLine.id}`}
                      className="inline-flex items-center min-h-[40px] px-3 text-sm font-semibold text-brand-maroon border border-brand-maroon"
                    >
                      {isBn
                        ? `${matchingCount}টি মেশিন দেখুন`
                        : `View ${matchingCount} machine${matchingCount > 1 ? 's' : ''}`}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          ref={stripRef}
          className="mt-6 flex gap-2 overflow-x-auto pb-3"
          role="list"
          aria-label={isBn ? 'পৃষ্ঠার থাম্বনেইল' : 'Page thumbnails'}
        >
          {Array.from({ length: BROCHURE_PAGE_COUNT }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              data-page={p}
              onClick={() => goTo(p, lineForPage(p)?.id)}
              className={`flex-shrink-0 w-[72px] border ${
                p === page ? 'border-brand-maroon ring-2 ring-brand-maroon/30' : 'border-slate-300'
              }`}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`${isBn ? 'পৃষ্ঠা' : 'Page'} ${p}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brochureThumbSrc(p)} alt="" width={72} height={93} className="w-full h-auto block" />
              <span className="block text-[10px] text-center py-0.5 bg-white">{p}</span>
            </button>
          ))}
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-sm font-semibold truncate pr-4">
              {title} · {page}/{BROCHURE_PAGE_COUNT}
            </p>
            <button type="button" onClick={() => setFullscreen(false)} className="p-3" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto flex items-start justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brochurePageSrc(page)} alt={title} className="max-w-full h-auto bg-white" />
          </div>
        </div>
      )}
    </div>
  );
}
