'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import {
  useCompany,
  useHeroSlides,
  useProducts,
  useSiteStats,
  useWebsiteContent,
} from '@/hooks/useSiteData';
import { MACHINE_VIDEO_SHOWCASES, toYoutubeEmbedUrl } from '@/data/videos';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Film,
  Images,
  Pause,
  Play,
  ShieldCheck,
  Youtube,
} from 'lucide-react';

export default function HeroSlider({ showStats = true }: { showStats?: boolean }) {
  const { locale } = useLocale();
  const [slides] = useHeroSlides();
  const [content] = useWebsiteContent();
  const [stats] = useSiteStats();
  const [products] = useProducts();
  const [company] = useCompany();

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [pausedByHover, setPausedByHover] = useState(false);
  const [mediaMode, setMediaMode] = useState<'photos' | 'video'>('photos');
  const [videoIdx, setVideoIdx] = useState(0);

  const isBn = locale === 'bn';
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const hero = content.hero;

  const slidesOrFallback = useMemo(
    () =>
      slides.length > 0
        ? slides
        : [
            {
              id: '1',
              imageUrl: '/images/slider1.png',
              titleEn: 'Food & Granule Processing Lines',
              titleBn: 'খাদ্য ও গ্রানুল প্রক্রিয়াকরণ লাইন',
            },
            {
              id: '2',
              imageUrl: '/images/slider2.png',
              titleEn: 'Cosmetics, Unani & Detergent Packing',
              titleBn: 'কসমেটিক্স, ইউনানী ও ডিটারজেন্ট প্যাকিং',
            },
            {
              id: '3',
              imageUrl: '/images/slider3.png',
              titleEn: 'Water Treatment & Filling Plants',
              titleBn: 'ওয়াটার ট্রিটমেন্ট ও ফিলিং প্ল্যান্ট',
            },
          ],
    [slides]
  );

  const featuredVideos = useMemo(() => MACHINE_VIDEO_SHOWCASES.slice(0, 4), []);
  const activeVideo = featuredVideos[videoIdx % featuredVideos.length] || featuredVideos[0];

  const activeYoutubeUrl = useMemo(() => {
    const cmsMatch = products.find((p) => p.slug === activeVideo.productSlug);
    return toYoutubeEmbedUrl(cmsMatch?.videoUrl || activeVideo.youtubeUrl);
  }, [products, activeVideo]);

  const videoReelFrames = useMemo(
    () => [activeVideo.posterImage, ...activeVideo.secondaryImages],
    [activeVideo]
  );
  const [reelFrameIdx, setReelFrameIdx] = useState(0);

  const count = slidesOrFallback.length;
  const safeIdx = current % count;
  const displayStats = stats.slice(0, 4);

  // Auto-advance photo slideshow (or reel frames when in video walkthrough mode)
  useEffect(() => {
    if (!autoPlay || pausedByHover) return;
    if (mediaMode === 'video' && activeYoutubeUrl) return;

    const timer = setInterval(() => {
      if (mediaMode === 'photos' && count > 1) {
        setCurrent((c) => (c + 1) % count);
      } else if (mediaMode === 'video') {
        setReelFrameIdx((f) => (f + 1) % videoReelFrames.length);
      }
    }, 4800);

    return () => clearInterval(timer);
  }, [autoPlay, pausedByHover, mediaMode, count, activeYoutubeUrl, videoReelFrames.length]);

  const goPrev = () => {
    setAutoPlay(false);
    if (mediaMode === 'video') {
      setVideoIdx((v) => (v - 1 + featuredVideos.length) % featuredVideos.length);
      setReelFrameIdx(0);
    } else {
      setCurrent((c) => (c - 1 + count) % count);
    }
  };

  const goNext = () => {
    setAutoPlay(false);
    if (mediaMode === 'video') {
      setVideoIdx((v) => (v + 1) % featuredVideos.length);
      setReelFrameIdx(0);
    } else {
      setCurrent((c) => (c + 1) % count);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      dx < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const youtubeChannelUrl = company?.youtubeUrl || 'https://www.youtube.com/@autopacbd';

  return (
    <section
      className="bg-brand-paper dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800"
      aria-label={isBn ? 'অটো প্যাক মেশিনারি পরিচিতি' : 'Auto Pac Machinery Showcase'}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-6 sm:pb-10 space-y-5 sm:space-y-6">
        {/* 1. VISUAL-FIRST SHOWCASE STAGE (Primary Attention Grabber at Very Top of Page) */}
        <div
          className="surface-card overflow-hidden shadow-sm"
          onMouseEnter={() => setPausedByHover(true)}
          onMouseLeave={() => setPausedByHover(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-roledescription="carousel"
          aria-label={isBn ? 'মেশিনারি ছবি ও ভিডিও শোকেস' : 'Machinery visual & video showcase'}
        >
          {/* Top Mode Bar Outside Image (Never Overlays Machine Photo) */}
          <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-maroon shrink-0" />
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate">
                {mediaMode === 'photos'
                  ? (isBn ? slidesOrFallback[safeIdx]?.titleBn : slidesOrFallback[safeIdx]?.titleEn) ||
                    (isBn ? 'অটো প্যাক মেশিনারি লাইন' : 'Auto Pac Machinery Line')
                  : isBn
                    ? activeVideo.titleBn
                    : activeVideo.titleEn}
              </p>
            </div>

            {/* Clean Photos vs Video Reel Mode Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="inline-flex rounded-md border border-stone-200 dark:border-stone-700 bg-brand-paper/60 dark:bg-stone-950 p-0.5"
                role="tablist"
                aria-label={isBn ? 'শোকেস মোড' : 'Showcase mode'}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mediaMode === 'photos'}
                  onClick={() => setMediaMode('photos')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    mediaMode === 'photos'
                      ? 'bg-brand-maroon text-white'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  <Images className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isBn ? 'ছবি শোকেস' : 'Gallery'}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mediaMode === 'video'}
                  onClick={() => {
                    setMediaMode('video');
                    setReelFrameIdx(0);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    mediaMode === 'video'
                      ? 'bg-brand-maroon text-white'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isBn ? 'ভিডিও ডেমো' : 'Video Reel'}</span>
                </button>
              </div>

              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-stone-200 dark:border-stone-700 text-[11px] font-semibold text-stone-700 dark:text-stone-300 hover:border-brand-maroon hover:text-brand-maroon transition-colors"
              >
                <Youtube className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Unobstructed High-Impact Image / Video Stage */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] lg:aspect-[21/9] min-h-[220px] sm:min-h-[340px] lg:min-h-[440px] bg-white dark:bg-stone-900 overflow-hidden">
            {mediaMode === 'photos' ? (
              slidesOrFallback.map((item, i) => (
                <div
                  key={item.id || i}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    i === safeIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-hidden={i !== safeIdx}
                >
                  <Image
                    src={item.imageUrl || '/images/slider1.png'}
                    alt={
                      (isBn ? item.titleBn : item.titleEn) ||
                      (isBn ? 'অটো প্যাক মেশিনারি' : 'Auto Pac machinery')
                    }
                    fill
                    className="object-contain p-1.5 sm:p-3"
                    priority={i === 0}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </div>
              ))
            ) : activeYoutubeUrl ? (
              <iframe
                src={activeYoutubeUrl}
                title={isBn ? activeVideo.titleBn : activeVideo.titleEn}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              videoReelFrames.map((src, idx) => (
                <div
                  key={`${activeVideo.id}-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === reelFrameIdx % videoReelFrames.length
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={src}
                    alt={isBn ? activeVideo.titleBn : activeVideo.titleEn}
                    fill
                    className="object-contain p-2 sm:p-4"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </div>
              ))
            )}

            {/* Edge Step Arrows (Never Block Center Subject) */}
            {(mediaMode === 'photos' ? count > 1 : featuredVideos.length > 1) && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={isBn ? 'আগের স্লাইড' : 'Previous'}
                  className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-md bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-brand-maroon hover:text-white hover:border-brand-maroon items-center justify-center shadow-sm transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={isBn ? 'পরের স্লাইড' : 'Next'}
                  className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-md bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-brand-maroon hover:text-white hover:border-brand-maroon items-center justify-center shadow-sm transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Focus Thumbnail Strip & Playback Controls Below Stage */}
          <div className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 px-3 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {mediaMode === 'photos' ? (
              <div
                role="tablist"
                aria-label={isBn ? 'স্লাইড নির্বাচন করুন' : 'Select machinery slide'}
                className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
              >
                {slidesOrFallback.map((slide, idx) => {
                  const isSelected = idx === safeIdx;
                  const label =
                    (isBn ? slide.titleBn : slide.titleEn) ||
                    (isBn ? `শোকেস ${idx + 1}` : `Showcase ${idx + 1}`);
                  return (
                    <button
                      key={slide.id || idx}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => {
                        setCurrent(idx);
                        setAutoPlay(false);
                      }}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border text-left transition-colors cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-brand-maroon text-white border-brand-maroon'
                          : 'bg-brand-paper/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-brand-maroon hover:text-brand-maroon dark:hover:text-white'
                      }`}
                    >
                      <div className="relative w-12 h-7 rounded-sm overflow-hidden bg-white border border-stone-200 dark:border-stone-700 shrink-0">
                        <Image
                          src={slide.imageUrl || '/images/slider1.png'}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <span className="text-xs font-semibold whitespace-nowrap max-w-[175px] truncate">
                        {String(idx + 1).padStart(2, '0')} · {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div
                role="tablist"
                aria-label={isBn ? 'ভিডিও ডেমো নির্বাচন করুন' : 'Select machinery video reel'}
                className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
              >
                {featuredVideos.map((vid, idx) => {
                  const isSelected = idx === videoIdx % featuredVideos.length;
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => {
                        setVideoIdx(idx);
                        setReelFrameIdx(0);
                      }}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border text-left transition-colors cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-brand-maroon text-white border-brand-maroon'
                          : 'bg-brand-paper/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-brand-maroon hover:text-brand-maroon dark:hover:text-white'
                      }`}
                    >
                      <div className="relative w-12 h-7 rounded-sm overflow-hidden bg-white border border-stone-200 dark:border-stone-700 shrink-0">
                        <Image
                          src={vid.posterImage}
                          alt=""
                          fill
                          className="object-contain p-0.5"
                          sizes="48px"
                        />
                      </div>
                      <span className="text-xs font-semibold whitespace-nowrap max-w-[175px] truncate">
                        {isBn ? vid.categoryLabelBn : vid.categoryLabelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Playback & Step Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setAutoPlay((p) => !p)}
                aria-label={
                  autoPlay
                    ? isBn
                      ? 'স্লাইডশো বিরতি'
                      : 'Pause slideshow'
                    : isBn
                      ? 'স্লাইডশো চালু'
                      : 'Play slideshow'
                }
                className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-200 hover:border-brand-maroon cursor-pointer"
              >
                {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{autoPlay ? (isBn ? 'অটো' : 'Auto') : isBn ? 'থামা' : 'Paused'}</span>
              </button>

              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 tabular-nums px-1">
                {mediaMode === 'photos'
                  ? `${String(safeIdx + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`
                  : `${String((videoIdx % featuredVideos.length) + 1).padStart(2, '0')} / ${String(featuredVideos.length).padStart(2, '0')}`}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={isBn ? 'আগের' : 'Previous'}
                  className="w-9 h-9 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 hover:border-brand-maroon hover:text-brand-maroon flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={isBn ? 'পরের' : 'Next'}
                  className="w-9 h-9 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 hover:border-brand-maroon hover:text-brand-maroon flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SUPPORTING EDITORIAL ANCHOR & INSTANT CONVERSION STRIP BELOW VISUALS */}
        <div className="surface-card p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-2">
            <p className="section-kicker">{isBn ? hero.eyebrowBn : hero.eyebrowEn}</p>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-[2.35rem] font-semibold tracking-tight text-stone-900 dark:text-white leading-[1.1] [text-wrap:balance]">
              {isBn ? hero.titleBn : hero.titleEn}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
              {isBn ? hero.ledeBn : hero.ledeEn}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col lg:items-end gap-3">
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full lg:w-auto lg:justify-end">
              <Link href="/contact" className="btn-primary whitespace-nowrap shrink-0">
                {isBn ? hero.ctaQuoteBn : hero.ctaQuoteEn}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/brochure" className="btn-secondary whitespace-nowrap shrink-0">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                {isBn ? '১২২-পৃষ্ঠার ক্যাটালগ' : '122-Page Catalog'}
              </Link>
              <a
                href="#find-machinery"
                className="btn-ghost whitespace-nowrap shrink-0 border border-stone-200 dark:border-stone-700 rounded-md"
              >
                {isBn ? hero.ctaFindBn : hero.ctaFindEn}
              </a>
            </div>
            <p className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
              <ShieldCheck className="w-4 h-4 text-brand-maroon shrink-0" aria-hidden="true" />
              <span>
                {isBn
                  ? 'এসএস-৩০৪ ফুড-গ্রেড · ঢাকায় ইনস্টলেশন ও স্পেয়ার পার্টস'
                  : 'SS-304 Food-Grade · Dhaka Commissioning & Spare Parts'}
              </span>
            </p>
          </div>
        </div>

        {/* 3. Verified 4-Column Track Record Bar */}
        {showStats && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800">
            {displayStats.map((s) => (
              <div key={s.id} className="px-5 py-4">
                <div className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-white tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                  {isBn ? s.labelBn : s.labelEn}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
