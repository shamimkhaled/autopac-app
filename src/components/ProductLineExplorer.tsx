'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import {
  BROCHURE_LINES,
  brochurePageSrc,
  lineHref,
  productSlugsForLine,
} from '@/data/brochure';
import { useCatalogMap } from '@/hooks/useSiteData';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function ProductLineExplorer() {
  const { locale } = useLocale();
  const isBn = locale === 'bn';
  const [catalogMap] = useCatalogMap();
  const [activeId, setActiveId] = useState(BROCHURE_LINES[0].id);
  const line = BROCHURE_LINES.find((l) => l.id === activeId) ?? BROCHURE_LINES[0];
  const machineCount = productSlugsForLine(line.id, catalogMap).length;
  const previewPages = line.pages.slice(0, 3);
  const quoteHref = `/contact?product=${encodeURIComponent(isBn ? line.shortBn : line.shortEn)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(16rem,20rem)_1fr] gap-0 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-md overflow-hidden">
      <div className="lg:hidden border-b border-stone-200 dark:border-stone-800 px-3 py-3 overflow-x-auto scrollbar-hide">
        <div role="listbox" aria-label={isBn ? 'পণ্য লাইন' : 'Product lines'} className="flex gap-2 w-max">
          {BROCHURE_LINES.map((item) => {
            const selected = item.id === line.id;
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => setActiveId(item.id)}
                className={`min-h-[40px] px-3 rounded-md text-sm font-medium whitespace-nowrap cursor-pointer border transition-colors duration-200 ${
                  selected
                    ? 'bg-brand-maroon text-white border-brand-maroon'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className="font-display mr-1.5 opacity-80">{item.number}</span>
                {isBn ? item.shortBn : item.shortEn}
              </button>
            );
          })}
        </div>
      </div>

      <nav
        className="hidden lg:block border-r border-stone-200 dark:border-stone-800 max-h-[34rem] overflow-y-auto"
        aria-label={isBn ? 'পণ্য লাইন' : 'Product lines'}
      >
        <p className="px-4 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-maroon">
          {isBn ? 'পণ্য লাইন' : 'Product lines'}
        </p>
        <ul>
          {BROCHURE_LINES.map((item) => {
            const selected = item.id === line.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-current={selected ? 'true' : undefined}
                  className={`w-full text-left px-4 py-2.5 flex items-baseline gap-3 cursor-pointer transition-colors duration-200 border-l-2 ${
                    selected
                      ? 'border-brand-maroon bg-brand-paper dark:bg-stone-800 text-stone-900 dark:text-white'
                      : 'border-transparent text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <span className="font-display text-xs tracking-widest text-brand-maroon w-6 shrink-0">
                    {item.number}
                  </span>
                  <span className="text-sm font-medium leading-snug">
                    {isBn ? item.shortBn : item.shortEn}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-5 sm:p-7 lg:p-8 flex flex-col">
        <p className="font-display text-sm tracking-widest text-brand-maroon">{line.number}</p>
        <h3 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-white tracking-tight leading-tight">
          {isBn ? line.shortBn : line.shortEn}
        </h3>
        <p className="mt-3 text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
          {isBn ? line.titleBn : line.titleEn}
        </p>
        <p className="mt-4 text-sm text-stone-500">
          <span className="font-medium text-stone-700 dark:text-stone-300">
            {isBn ? 'যা প্যাক করে: ' : 'Packs: '}
          </span>
          {line.packables.join(', ')}
        </p>

        <div
          className={`mt-6 grid gap-2 sm:gap-3 ${
            previewPages.length === 1
              ? 'grid-cols-1'
              : previewPages.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3 grid-rows-2'
          }`}
        >
          {previewPages.map((page, i) => (
            <Link
              key={page}
              href={`/brochure?line=${line.id}&page=${page}`}
              className={`relative overflow-hidden rounded-md border border-stone-200 dark:border-stone-700 bg-stone-100 cursor-pointer ${
                previewPages.length === 1
                  ? 'aspect-[16/10]'
                  : previewPages.length === 2
                    ? 'aspect-[4/3]'
                    : i === 0
                      ? 'col-span-2 row-span-2 min-h-[12rem] sm:min-h-[16rem]'
                      : 'min-h-[5.5rem] sm:min-h-[7.5rem]'
              }`}
            >
              <Image
                src={brochurePageSrc(page)}
                alt={`${isBn ? line.shortBn : line.shortEn} — ${isBn ? 'ক্যাটালগ' : 'catalog'} ${page}`}
                fill
                className="object-cover object-top"
                sizes={i === 0 ? '(max-width: 1024px) 66vw, 420px' : '(max-width: 1024px) 33vw, 160px'}
              />
            </Link>
          ))}
        </div>

        <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
          <Link href={lineHref(line.id, catalogMap)} className="btn-primary">
            {machineCount > 0
              ? isBn
                ? `মেশিন দেখুন (${machineCount})`
                : `View machines (${machineCount})`
              : isBn
                ? 'ক্যাটালগ খুলুন'
                : 'Open catalog'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link href={`/brochure?line=${line.id}`} className="btn-secondary">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            {isBn ? 'ক্যাটালগ পৃষ্ঠা' : 'Catalog pages'}
          </Link>
          <Link href={quoteHref} className="btn-ghost">
            {isBn ? 'এই লাইনের কোটেশন' : 'Quote this line'}
          </Link>
        </div>
      </div>
    </div>
  );
}
