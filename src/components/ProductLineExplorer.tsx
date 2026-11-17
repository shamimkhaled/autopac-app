'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import {
  BROCHURE_LINES,
  brochurePageSrc,
  lineHref,
  productSlugsForLine,
} from '@/data/brochure';
import { useCatalogMap, useProducts } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';
import { ArrowRight, BookOpen, CheckCircle2, Layers } from 'lucide-react';

const LINE_STUDIO_IMAGES: Record<string, string> = {
  'agro-packing': '/machines/ap-110m-granule.webp',
  'water-treatment': '/machines/ro-uv-water-plant.webp',
  'snacks-chanachur': '/machines/ap-450m-snacks.webp',
  beverage: '/machines/water-bottle-filling-capping.webp',
  biscuit: '/machines/flow-wrap-solid.webp',
  candy: '/machines/jelly-strip-packaging.webp',
  chocolate: '/machines/chocolate-depositor-line.webp',
  'oil-milk': '/machines/oil-expeller-filter.webp',
  pasteurizer: '/machines/milk-pasteurizing-line.webp',
  honey: '/machines/digital-liquid-filler.webp',
  noodles: '/machines/noodles-production-line.webp',
  cosmetics: '/machines/liquid-detergent-mixer.webp',
  sealing: '/machines/frd-1000w-sealer.webp',
  'blow-moulding': '/machines/auto-beverage-filler.webp',
  feed: '/machines/multi-mill-crusher.webp',
  'mosquito-coil': '/machines/auto-roaster-machine.webp',
};

function parseFirstImage(p: Product): string {
  try {
    const arr = Array.isArray(p.images)
      ? p.images
      : typeof p.images === 'string'
        ? JSON.parse(p.images || '[]')
        : [];
    if (Array.isArray(arr) && arr[0]) return arr[0];
  } catch {
    // fallback
  }
  return '/machines/ap-110m-granule.webp';
}

function parseKeySpec(p: Product, isBn: boolean): string {
  try {
    const specs: { keyEn: string; keyBn: string; value: string; unit?: string }[] = Array.isArray(
      p.specs
    )
      ? p.specs
      : typeof p.specs === 'string'
        ? JSON.parse(p.specs || '[]')
        : [];
    const match =
      specs.find((s) => /range|capacity|volume|speed|power|weight/i.test(s.keyEn)) || specs[0];
    if (!match) return '';
    return `${isBn ? match.keyBn : match.keyEn}: ${match.value}${match.unit ? ` ${match.unit}` : ''}`;
  } catch {
    return '';
  }
}

export default function ProductLineExplorer() {
  const { locale } = useLocale();
  const isBn = locale === 'bn';
  const [catalogMap] = useCatalogMap();
  const [products] = useProducts();
  const [activeId, setActiveId] = useState(BROCHURE_LINES[0].id);

  const activeIdx = Math.max(
    0,
    BROCHURE_LINES.findIndex((l) => l.id === activeId)
  );
  const line = BROCHURE_LINES[activeIdx] ?? BROCHURE_LINES[0];
  const lineNumber = String(activeIdx + 1).padStart(2, '0');
  const slugs = useMemo(() => productSlugsForLine(line.id, catalogMap), [line.id, catalogMap]);

  const matchedMachines = useMemo(() => {
    if (slugs.length === 0) return [];
    const map = new Map(products.map((p) => [p.slug, p]));
    return slugs
      .map((slug) => map.get(slug))
      .filter((p): p is Product => Boolean(p));
  }, [slugs, products]);

  const spotlightMachines = matchedMachines.slice(0, 3);
  const quoteHref = `/contact?product=${encodeURIComponent(isBn ? line.shortBn : line.shortEn)}`;
  const fallbackStudioImage = LINE_STUDIO_IMAGES[line.id] || '/machines/ap-110m-granule.webp';

  return (
    <div className="space-y-4">
      {/* 16-Line Full-Visibility Selector Grid (Zero Scrollbar) */}
      <div
        role="tablist"
        aria-label={isBn ? '১৬টি মেশিনারি লাইন' : '16 Machinery Product Lines'}
        className="flex lg:grid lg:grid-cols-4 gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide"
      >
        {BROCHURE_LINES.map((item, idx) => {
          const selected = item.id === line.id;
          const seq = String(idx + 1).padStart(2, '0');
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(item.id)}
              className={`min-h-[44px] px-3.5 py-2.5 rounded-md border text-left flex items-center gap-2.5 transition-colors duration-150 cursor-pointer shrink-0 whitespace-nowrap lg:whitespace-normal ${
                selected
                  ? 'bg-brand-maroon text-white border-brand-maroon shadow-sm'
                  : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:border-brand-maroon/70 hover:text-brand-maroon dark:hover:text-white'
              }`}
            >
              <span
                className={`font-display text-xs font-semibold tracking-wider tabular-nums shrink-0 ${
                  selected ? 'text-white/80' : 'text-brand-maroon'
                }`}
              >
                {seq}
              </span>
              <span className="text-[13px] font-semibold leading-snug truncate">
                {isBn ? item.shortBn : item.shortEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* High-Attention Line Spotlight Stage */}
      <div className="surface-card overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Editorial Summary & Actions */}
        <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-stone-900 border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-stone-800">
          <div>
            <p className="section-kicker tabular-nums">
              {isBn ? `লাইন ${lineNumber} / ১৬` : `Line ${lineNumber} of ${BROCHURE_LINES.length}`}
            </p>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-white tracking-tight leading-tight">
              {isBn ? line.shortBn : line.shortEn}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              {isBn ? line.titleBn : line.titleEn}
            </p>

            {/* Unboxed Clean Packables Spec */}
            <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <p>
                <span className="font-semibold text-stone-900 dark:text-stone-200">
                  {isBn ? 'উপযোগী পণ্য: ' : 'Applications: '}
                </span>
                {line.packables.join(' · ')}
              </p>
              <p className="inline-flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-maroon shrink-0" aria-hidden="true" />
                {matchedMachines.length > 0
                  ? isBn
                    ? `${matchedMachines.length}টি প্রস্তুত মেশিন কনফিগারেশন`
                    : `${matchedMachines.length} stocked & custom-order configurations`
                  : isBn
                    ? `অফিসিয়াল ক্যাটালগ পৃষ্ঠা ${line.startPage}-এ পূর্ণ বিবরণ`
                    : `Full turnkey layout in Catalog Sheet p.${line.startPage}`}
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-2.5">
            <Link
              href={lineHref(line.id, catalogMap)}
              className="btn-primary w-full justify-between whitespace-nowrap"
            >
              <span>
                {matchedMachines.length > 0
                  ? isBn
                    ? `সব মেশিন দেখুন (${matchedMachines.length})`
                    : `Explore line machines (${matchedMachines.length})`
                  : isBn
                    ? `ক্যাটালগ শিট p.${line.startPage} দেখুন`
                    : `Inspect catalog sheet p.${line.startPage}`}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/brochure?line=${line.id}&page=${line.startPage}`}
                className="btn-secondary text-xs px-3 whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {isBn ? `শিট p.${line.startPage}` : `Sheet p.${line.startPage}`}
              </Link>
              <Link href={quoteHref} className="btn-secondary text-xs px-3 whitespace-nowrap">
                {isBn ? 'কোটেশন চান' : 'Quote line'}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Studio Machinery Showcase (Uncropped & High-Focus) */}
        <div className="lg:col-span-8 p-5 sm:p-7 bg-brand-paper/60 dark:bg-stone-950/60 flex flex-col justify-between gap-4">
          {spotlightMachines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              {spotlightMachines.map((machine) => {
                const imgSrc = parseFirstImage(machine);
                const specText = parseKeySpec(machine, isBn);
                const mName = isBn && machine.nameBn ? machine.nameBn : machine.nameEn;
                return (
                  <Link
                    key={machine.id}
                    href={`/products/${machine.slug}`}
                    className="surface-card surface-card-hover overflow-hidden flex flex-col group"
                  >
                    <div className="relative aspect-[4/3] bg-white border-b border-stone-200 dark:border-stone-800 overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={mName}
                        fill
                        className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, 240px"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        {machine.modelCode && (
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-maroon">
                            {machine.modelCode}
                          </p>
                        )}
                        <h4 className="mt-1 text-sm font-semibold text-stone-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-maroon transition-colors">
                          {mName}
                        </h4>
                      </div>
                      {specText && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate tabular-nums pt-2 border-t border-stone-100 dark:border-stone-800">
                          {specText}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1 items-stretch">
              <div className="sm:col-span-7 surface-card overflow-hidden flex flex-col">
                <div className="relative flex-1 min-h-[220px] bg-white border-b border-stone-200 dark:border-stone-800">
                  <Image
                    src={fallbackStudioImage}
                    alt={isBn ? line.shortBn : line.shortEn}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
                <div className="p-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-maroon">
                      {isBn ? 'টার্নকি প্রোডাকশন লাইন' : 'Turnkey Processing Line'}
                    </p>
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">
                      {isBn ? line.shortBn : line.shortEn}
                    </p>
                  </div>
                  <Link href={quoteHref} className="btn-ghost text-xs px-2.5 whitespace-nowrap">
                    {isBn ? 'স্পেকস চান' : 'Get Specs'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <Link
                href={`/brochure?line=${line.id}&page=${line.startPage}`}
                className="sm:col-span-5 surface-card surface-card-hover overflow-hidden flex flex-col group"
              >
                <div className="relative flex-1 min-h-[220px] bg-white border-b border-stone-200 dark:border-stone-800">
                  <Image
                    src={brochurePageSrc(line.startPage)}
                    alt={`${isBn ? line.shortBn : line.shortEn} — Catalog page ${line.startPage}`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 100vw, 260px"
                  />
                </div>
                <div className="p-4 flex items-center justify-between text-xs font-semibold text-brand-maroon">
                  <span className="tabular-nums">
                    {isBn ? `অফিসিয়াল শিট p.${line.startPage}` : `Catalog Sheet p.${line.startPage}`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </div>
          )}

          {/* Compact Uncropped Printed Brochure Sheet Strip */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-12 rounded border border-stone-200 dark:border-stone-700 bg-white overflow-hidden shrink-0">
                <Image
                  src={brochurePageSrc(line.startPage)}
                  alt={`${isBn ? 'পৃষ্ঠা' : 'Page'} ${line.startPage}`}
                  fill
                  className="object-contain p-0.5"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-maroon shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {isBn
                      ? `১২২-পৃষ্ঠার অফিশিয়াল ক্যাটালগ শিট: পৃষ্ঠা ${line.pages.join(', ')}`
                      : `Official Printed Brochure Sheets: Pages ${line.pages.join(', ')}`}
                  </span>
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                  {isBn
                    ? 'মূল প্রিন্টেড শিট দেখতে পাশের লিংকে ক্লিক করুন'
                    : 'Inspect the original printed spec sheet side-by-side in our catalog viewer'}
                </p>
              </div>
            </div>
            <Link
              href={`/brochure?line=${line.id}&page=${line.startPage}`}
              className="text-xs font-semibold text-brand-maroon hover:underline whitespace-nowrap shrink-0 inline-flex items-center gap-1"
            >
              {isBn ? `পৃষ্ঠা ${line.startPage} খুলুন` : `Open p.${line.startPage}`}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
