'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import { packableItems } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';
import { BookOpen } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { locale, t } = useLocale();
  const isBn = locale === 'bn';
  const category = product.category ?? null;

  let images: string[] = [];
  try {
    images = Array.isArray(product.images)
      ? product.images
      : typeof product.images === 'string'
        ? JSON.parse(product.images || '[]')
        : [];
  } catch {
    images = [];
  }
  const mainImage = images[0] || '/machines/ap-110m-granule.webp';

  let specs: { keyEn: string; keyBn: string; value: string; unit?: string }[] = [];
  try {
    specs = Array.isArray(product.specs)
      ? product.specs
      : typeof product.specs === 'string'
        ? JSON.parse(product.specs || '[]')
        : [];
  } catch {
    specs = [];
  }

  let packables: { id: string; nameEn: string; nameBn: string }[] = [];
  try {
    const raw = Array.isArray(product.packableIds)
      ? product.packableIds
      : typeof product.packableIds === 'string'
        ? JSON.parse(product.packableIds || '[]')
        : [];
    packables = raw
      .slice(0, 4)
      .map((id: string) => packableItems.find((p) => p.id === id) || { id, nameEn: id, nameBn: id });
  } catch {
    packables = [];
  }

  const name = isBn && product.nameBn ? product.nameBn : product.nameEn;
  const shortDesc = isBn && product.shortDescBn ? product.shortDescBn : product.shortDescEn;
  const categoryName = category
    ? isBn && category.nameBn
      ? category.nameBn
      : category.nameEn
    : isBn
      ? 'মেশিনারি'
      : 'Machinery';

  const keySpec = specs.find((s) =>
    /range|capacity|volume|power|speed|steel|weight|model/i.test(s.keyEn)
  ) || specs[0];
  const quoteHref = `/contact?product=${encodeURIComponent(name)}`;
  const catalogHref = product.brochurePage ? `/brochure?page=${product.brochurePage}` : null;

  return (
    <article className="surface-card surface-card-hover overflow-hidden flex flex-col h-full group">
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-[4/3] overflow-hidden bg-white border-b border-stone-200 dark:border-stone-800 cursor-pointer"
      >
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink truncate">
          {categoryName}
          {product.modelCode ? ` · ${product.modelCode}` : ''}
        </p>

        <Link href={`/products/${product.slug}`} className="mt-1.5 block">
          <h3 className="text-base sm:text-lg font-semibold text-stone-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-ink transition-colors">
            {name}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {shortDesc}
        </p>

        {(keySpec || packables.length > 0) && (
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-1 text-xs text-stone-600 dark:text-stone-400">
            {keySpec && (
              <p className="font-medium text-stone-800 dark:text-stone-200 truncate">
                {isBn ? keySpec.keyBn : keySpec.keyEn}: {keySpec.value}
                {keySpec.unit ? ` ${keySpec.unit}` : ''}
              </p>
            )}
            {packables.length > 0 && (
              <p className="truncate text-stone-500 dark:text-stone-400">
                {isBn ? 'পণ্য: ' : 'Packs: '}
                {packables.map((p) => (isBn ? p.nameBn : p.nameEn)).join(' · ')}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-4">
          <Link
            href={`/products/${product.slug}`}
            className="btn-secondary flex-1 text-[13px] px-3 whitespace-nowrap shrink-0"
          >
            {t('products.viewDetails') || 'Details'}
          </Link>
          {catalogHref && (
            <Link
              href={catalogHref}
              className="inline-flex items-center justify-center min-h-[44px] w-11 border border-stone-300 dark:border-stone-700 rounded-md text-stone-700 dark:text-stone-300 hover:border-brand-maroon dark:hover:border-brand-ink hover:text-brand-ink transition-colors shrink-0"
              title={isBn ? `ক্যাটালগ পৃষ্ঠা ${product.brochurePage}` : `Brochure sheet p.${product.brochurePage}`}
              aria-label={isBn ? `ক্যাটালগ পৃষ্ঠা ${product.brochurePage}` : `Brochure sheet page ${product.brochurePage}`}
            >
              <BookOpen className="w-4 h-4" />
            </Link>
          )}
          <Link
            href={quoteHref}
            className="btn-primary flex-1 text-[13px] px-3 whitespace-nowrap shrink-0"
          >
            {t('products.quote') || 'Quote'}
          </Link>
        </div>
      </div>
    </article>
  );
}
