'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useCompany, useProducts } from '@/hooks/useSiteData';
import {
  MACHINE_VIDEO_SHOWCASES,
  toYoutubeEmbedUrl,
  type MachineVideoShowcase,
} from '@/data/videos';
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Layers,
  MessageSquare,
  Pause,
  Play,
  SkipForward,
  Youtube,
} from 'lucide-react';

const VIDEO_CATEGORIES = [
  { id: 'all', en: 'All Lines', bn: 'সব মেশিন' },
  { id: 'granule-powder', en: 'Granule & Powder', bn: 'গ্রানুল ও পাউডার' },
  { id: 'liquid-beverage', en: 'Liquid & Beverage', bn: 'তরল ও পানীয়' },
  { id: 'cip-tanks', en: 'CIP & 304-SS Tanks', bn: 'সিআইপি ও ৩০৪-এসএস' },
  { id: 'sealing-flowwrap', en: 'Sealing & Flow-Wrap', bn: 'সিলিং ও ফ্লো-র‍্যাপ' },
] as const;

interface VideoShowcaseSectionProps {
  compact?: boolean;
}

export default function VideoShowcaseSection({ compact = false }: VideoShowcaseSectionProps) {
  const { locale } = useLocale();
  const [products] = useProducts();
  const [company] = useCompany();
  const isBn = locale === 'bn';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string>(MACHINE_VIDEO_SHOWCASES[0].id);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'walkthrough' | 'youtube'>('walkthrough');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return MACHINE_VIDEO_SHOWCASES;
    return MACHINE_VIDEO_SHOWCASES.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  const activeVideo: MachineVideoShowcase = useMemo(
    () => filtered.find((v) => v.id === selectedId) ?? filtered[0] ?? MACHINE_VIDEO_SHOWCASES[0],
    [filtered, selectedId]
  );

  const cmsProduct = useMemo(
    () => products.find((p) => p.slug === activeVideo.productSlug),
    [products, activeVideo.productSlug]
  );
  const configuredYoutubeUrl = cmsProduct?.videoUrl || activeVideo.youtubeUrl;
  const youtubeEmbedUrl = useMemo(
    () => toYoutubeEmbedUrl(configuredYoutubeUrl),
    [configuredYoutubeUrl]
  );

  const reelFrames = useMemo(
    () => [activeVideo.posterImage, ...activeVideo.secondaryImages],
    [activeVideo]
  );

  useEffect(() => {
    setStepIdx(0);
    setViewMode(youtubeEmbedUrl ? 'youtube' : 'walkthrough');
  }, [activeVideo.id, youtubeEmbedUrl]);

  useEffect(() => {
    if (!playing || viewMode === 'youtube') return;
    const timer = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % activeVideo.steps.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [playing, viewMode, activeVideo.steps.length]);

  const currentFrameSrc = reelFrames[stepIdx % reelFrames.length] || activeVideo.posterImage;
  const currentStep = activeVideo.steps[stepIdx] || activeVideo.steps[0];
  const visibleCards = compact ? filtered.slice(0, 3) : filtered;
  const channelUrl = company?.youtubeUrl || 'https://www.youtube.com/@autopacbd';

  return (
    <div className="space-y-5">
      {/* Category Filter Rail + YouTube Channel Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
          role="tablist"
          aria-label={isBn ? 'ভিডিও ক্যাটাগরি' : 'Video categories'}
        >
          {VIDEO_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const firstInCat =
                    cat.id === 'all'
                      ? MACHINE_VIDEO_SHOWCASES[0]
                      : MACHINE_VIDEO_SHOWCASES.find((v) => v.category === cat.id);
                  if (firstInCat) setSelectedId(firstInCat.id);
                }}
                className={`filter-chip whitespace-nowrap shrink-0 ${
                  active ? 'filter-chip-active' : ''
                }`}
              >
                {isBn ? cat.bn : cat.en}
              </button>
            );
          })}
        </div>

        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-stone-200 dark:border-stone-700 bg-[var(--surface)] dark:bg-stone-900 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-brand-maroon dark:hover:border-brand-ink hover:text-brand-ink transition-colors whitespace-nowrap shrink-0"
        >
          <Youtube className="w-4 h-4 text-red-600" aria-hidden="true" />
          <span>{isBn ? 'অটো প্যাক ইউটিউব চ্যানেল' : 'Auto Pac YouTube'}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
        </a>
      </div>

      {/* Main Theater Stage (Unobstructed Viewport + Single Clean Workflow Column) */}
      <div className="surface-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 dark:divide-stone-800">
        {/* Visual Reel / YouTube Viewport */}
        <div className="lg:col-span-7 bg-stone-950 flex flex-col justify-between">
          <div className="relative aspect-[16/10] bg-white overflow-hidden">
            {viewMode === 'youtube' && youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={isBn ? activeVideo.titleBn : activeVideo.titleEn}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <Image
                key={`${activeVideo.id}-${currentFrameSrc}`}
                src={currentFrameSrc}
                alt={isBn ? activeVideo.titleBn : activeVideo.titleEn}
                fill
                className="object-contain p-5 sm:p-7 transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            )}

            {youtubeEmbedUrl && (
              <div className="absolute bottom-3 right-3 z-10 inline-flex bg-stone-950/90 p-1 rounded-md border border-stone-700">
                <button
                  type="button"
                  onClick={() => setViewMode('youtube')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    viewMode === 'youtube' ? 'bg-brand-maroon text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" />
                  YouTube
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('walkthrough')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    viewMode === 'walkthrough' ? 'bg-brand-maroon text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {isBn ? 'ধাপসমূহ' : 'Steps'}
                </button>
              </div>
            )}
          </div>

          {/* Sleek Single-Row Scrubber & Technical Spec Strip */}
          <div className="bg-stone-950 text-white px-4 py-3.5 border-t border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    if (viewMode === 'youtube') setViewMode('walkthrough');
                    setPlaying((p) => !p);
                  }}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-brand-maroon hover:bg-brand-maroon-hover text-white transition-colors shrink-0 cursor-pointer"
                  aria-label={
                    playing ? (isBn ? 'বিরতি দিন' : 'Pause walkthrough') : isBn ? 'চালান' : 'Play walkthrough'
                  }
                >
                  {playing && viewMode === 'walkthrough' ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (viewMode === 'youtube') setViewMode('walkthrough');
                    setStepIdx((s) => (s + 1) % activeVideo.steps.length);
                  }}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-stone-700 hover:border-stone-500 text-stone-200 transition-colors shrink-0 cursor-pointer"
                  aria-label={isBn ? 'পরবর্তী ধাপ' : 'Next stage'}
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <div className="min-w-0 pl-1.5">
                  <p className="text-xs font-semibold text-white truncate">
                    {isBn ? currentStep.labelBn : currentStep.labelEn}
                  </p>
                  <p className="text-xs text-stone-400 truncate">
                    {activeVideo.modelCode} · {activeVideo.capacityHighlight} · {activeVideo.duration}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 whitespace-nowrap shrink-0 tabular-nums">
                {String(stepIdx + 1).padStart(2, '0')} / {String(activeVideo.steps.length).padStart(2, '0')}
              </span>
            </div>

            {/* Clean Progress Segments */}
            <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
              {activeVideo.steps.map((step, i) => (
                <div
                  key={step.labelEn}
                  className={`h-1 rounded-full transition-colors ${
                    i === stepIdx && viewMode === 'walkthrough'
                      ? 'bg-brand-maroon'
                      : i < stepIdx && viewMode === 'walkthrough'
                        ? 'bg-stone-500'
                        : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Info & Single Interactive Workflow Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="section-kicker">
              {isBn ? activeVideo.categoryLabelBn : activeVideo.categoryLabelEn} · {activeVideo.modelCode}
            </p>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-white tracking-tight leading-tight">
              {isBn ? activeVideo.titleBn : activeVideo.titleEn}
            </h3>
            <p className="mt-2.5 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {isBn ? activeVideo.subtitleBn : activeVideo.subtitleEn}
            </p>

            {/* Clean Hairline-Separated Interactive Step List */}
            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400 mb-2">
                {isBn ? 'কাজের ধাপসমূহ' : 'Operation workflow'}
              </p>
              <ol className="divide-y divide-stone-200 dark:divide-stone-800 border-y border-stone-200 dark:border-stone-800">
                {activeVideo.steps.map((step, idx) => {
                  const active = idx === stepIdx && viewMode === 'walkthrough';
                  return (
                    <li key={step.labelEn}>
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode('walkthrough');
                          setStepIdx(idx);
                          setPlaying(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors cursor-pointer ${
                          active
                            ? 'bg-brand-paper dark:bg-stone-800/70'
                            : 'hover:bg-stone-50 dark:hover:bg-stone-800/30'
                        }`}
                      >
                        <span
                          className={`font-display text-xs font-semibold tabular-nums mt-0.5 shrink-0 ${
                            active ? 'text-brand-ink' : 'text-stone-400'
                          }`}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold leading-snug ${
                              active ? 'text-brand-ink' : 'text-stone-900 dark:text-white'
                            }`}
                          >
                            {isBn ? step.labelBn : step.labelEn}
                          </p>
                          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-snug">
                            {isBn ? step.detailBn : step.detailEn}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Restrained Action Bar */}
          <div className="mt-6 space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                href={`/contact?product=${encodeURIComponent(isBn ? activeVideo.titleBn : activeVideo.titleEn)}`}
                className="btn-primary flex-1 text-[13px] whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                {isBn ? 'কোটেশন চান' : 'Request Quote'}
              </Link>
              <Link
                href={`/products/${activeVideo.productSlug}`}
                className="btn-secondary text-[13px] whitespace-nowrap"
              >
                {isBn ? 'স্পেসিফিকেশন' : 'Machine Specs'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <Link
                href={`/brochure?page=${activeVideo.brochurePage}`}
                className="inline-flex items-center gap-1.5 font-semibold text-stone-600 dark:text-stone-400 hover:text-brand-ink transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {isBn ? `ক্যাটালগ শিট p.${activeVideo.brochurePage}` : `Catalog Sheet p.${activeVideo.brochurePage}`}
              </Link>
              <a
                href={configuredYoutubeUrl || channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-stone-600 dark:text-stone-400 hover:text-brand-ink transition-colors"
              >
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                {isBn ? 'ইউটিউবে দেখুন' : 'Watch on YouTube'}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline-Divided Machine Reel Selector Bar */}
      <div className="surface-card overflow-hidden grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800">
        {visibleCards.map((item) => {
          const isSelected = item.id === activeVideo.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedId(item.id);
                setPlaying(false);
              }}
              className={`text-left p-4 flex items-center gap-3.5 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-brand-paper/80 dark:bg-stone-800/70 border-b-2 sm:border-b-0 sm:border-t-2 border-brand-maroon dark:border-brand-ink'
                  : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
              }`}
            >
              <div className="relative w-20 h-16 rounded bg-white border border-stone-200 dark:border-stone-700 shrink-0 overflow-hidden">
                <Image
                  src={item.posterImage}
                  alt={isBn ? item.titleBn : item.titleEn}
                  fill
                  className="object-contain p-1.5"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-ink truncate">
                  {isBn ? item.categoryLabelBn : item.categoryLabelEn}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-stone-900 dark:text-white line-clamp-1">
                  {isBn ? item.titleBn : item.titleEn}
                </p>
                <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400 truncate tabular-nums">
                  {item.capacityHighlight} · {item.duration}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
