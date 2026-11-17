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

  // Check if the corresponding CMS machine has a configured YouTube link
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
  const visibleCards = compact ? filtered.slice(0, 4) : filtered;
  const channelUrl = company?.youtubeUrl || 'https://www.youtube.com/@autopacbd';

  return (
    <div className="space-y-6">
      {/* Category filter bar + YouTube channel header action */}
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
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-brand-maroon hover:text-brand-maroon transition-colors whitespace-nowrap shrink-0"
        >
          <Youtube className="w-4 h-4 text-red-600" aria-hidden="true" />
          <span>{isBn ? 'অটো প্যাক ইউটিউব চ্যানেল' : 'Auto Pac YouTube (@autopacbd)'}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
        </a>
      </div>

      {/* Main Theater Stage */}
      <div className="surface-card overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Visual Reel / YouTube Viewport */}
        <div className="lg:col-span-7 bg-stone-950 flex flex-col justify-between">
          <div className="relative aspect-[16/10] bg-white dark:bg-stone-900 overflow-hidden">
            {viewMode === 'youtube' && youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={isBn ? activeVideo.titleBn : activeVideo.titleEn}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <Image
                  key={`${activeVideo.id}-${currentFrameSrc}`}
                  src={currentFrameSrc}
                  alt={isBn ? activeVideo.titleBn : activeVideo.titleEn}
                  fill
                  className="object-contain p-4 sm:p-6 transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <div className="px-3 py-1.5 bg-stone-950/85 text-white text-[11px] font-semibold uppercase tracking-[0.12em] rounded-md">
                    {activeVideo.modelCode} · {activeVideo.capacityHighlight}
                  </div>
                  <div className="px-2.5 py-1.5 bg-stone-950/85 text-white text-[11px] font-medium tabular-nums rounded-md">
                    {activeVideo.duration}
                  </div>
                </div>
              </>
            )}

            {/* Switcher if a YouTube video URL is configured in CMS */}
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

          {/* Interactive Stage Scrubber Bar */}
          <div className="bg-stone-950 text-white px-4 py-3.5 border-t border-stone-800 space-y-3">
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
                <div className="min-w-0 pl-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {isBn ? currentStep.labelBn : currentStep.labelEn}
                  </p>
                  <p className="text-xs text-stone-300 line-clamp-1">
                    {isBn ? currentStep.detailBn : currentStep.detailEn}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 whitespace-nowrap shrink-0 tabular-nums">
                {stepIdx + 1} / {activeVideo.steps.length}
              </span>
            </div>

            {/* 4-Step Interactive Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {activeVideo.steps.map((step, i) => {
                const isCurrent = i === stepIdx && viewMode === 'walkthrough';
                return (
                  <button
                    key={step.labelEn}
                    type="button"
                    onClick={() => {
                      setViewMode('walkthrough');
                      setStepIdx(i);
                      setPlaying(false);
                    }}
                    className={`text-left px-2.5 py-2 rounded border transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-brand-maroon border-brand-maroon text-white'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <span className="block text-[11px] font-semibold truncate">
                      {isBn ? step.labelBn : step.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Info & Action Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800">
          <div>
            <p className="section-kicker">
              {isBn ? activeVideo.categoryLabelBn : activeVideo.categoryLabelEn} · {activeVideo.modelCode}
            </p>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-white tracking-tight leading-tight">
              {isBn ? activeVideo.titleBn : activeVideo.titleEn}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              {isBn ? activeVideo.subtitleBn : activeVideo.subtitleEn}
            </p>

            {/* Step Breakdown List */}
            <div className="mt-6 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                {isBn ? 'কাজের ধাপসমূহ' : 'Operation workflow'}
              </p>
              <ol className="space-y-2">
                {activeVideo.steps.map((step, idx) => {
                  const active = idx === stepIdx;
                  return (
                    <li key={step.labelEn}>
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode('walkthrough');
                          setStepIdx(idx);
                          setPlaying(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-md border transition-colors cursor-pointer ${
                          active
                            ? 'bg-brand-paper dark:bg-stone-800 border-brand-maroon text-stone-900 dark:text-white'
                            : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                        }`}
                      >
                        <p className="text-xs font-semibold text-stone-900 dark:text-white">
                          {isBn ? step.labelBn : step.labelEn}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-snug">
                          {isBn ? step.detailBn : step.detailEn}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Stable Action Row */}
          <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-2.5">
            <Link
              href={`/contact?product=${encodeURIComponent(isBn ? activeVideo.titleBn : activeVideo.titleEn)}`}
              className="btn-primary flex-1 text-[13px] whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
              {isBn ? 'কোটেশন চান' : 'Request Quote'}
            </Link>
            <Link
              href={`/products/${activeVideo.productSlug}`}
              className="btn-secondary text-[13px] whitespace-nowrap shrink-0"
            >
              {isBn ? 'স্পেসিফিকেশন' : 'Machine Specs'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/brochure?page=${activeVideo.brochurePage}`}
              className="btn-secondary text-[13px] whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {isBn ? `পৃষ্ঠা ${activeVideo.brochurePage}` : `Sheet p.${activeVideo.brochurePage}`}
            </Link>
            <a
              href={configuredYoutubeUrl || channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-[13px] whitespace-nowrap shrink-0"
            >
              <Youtube className="w-4 h-4 text-red-600" />
              YouTube
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className={`surface-card text-left p-3.5 flex items-center gap-3.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-maroon ring-1 ring-brand-maroon bg-white dark:bg-stone-900'
                  : 'hover:border-brand-maroon/60'
              }`}
            >
              <div className="relative w-24 h-20 rounded bg-white border border-stone-200 dark:border-stone-700 shrink-0 overflow-hidden">
                <Image
                  src={item.posterImage}
                  alt={isBn ? item.titleBn : item.titleEn}
                  fill
                  className="object-contain p-1.5"
                  sizes="96px"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-stone-950/85 text-white text-[10px] font-medium rounded tabular-nums">
                  {item.duration}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-maroon truncate">
                  {isBn ? item.categoryLabelBn : item.categoryLabelEn}
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-white line-clamp-2 leading-snug">
                  {isBn ? item.titleBn : item.titleEn}
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 truncate tabular-nums">
                  {item.capacityHighlight}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
