'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import { packableItems } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { locale, t } = useLocale();
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
  const mainImage = images[0] || '/images/slider1.png';

  let packables: { id: string; nameEn: string; nameBn: string }[] = [];
  try {
    const raw = Array.isArray(product.packableIds)
      ? product.packableIds
      : typeof product.packableIds === 'string'
        ? JSON.parse(product.packableIds || '[]')
        : [];
    packables = raw
      .slice(0, 3)
      .map((id: string) => packableItems.find((p) => p.id === id) || { id, nameEn: id, nameBn: id });
  } catch {
    packables = [];
  }

  const name = locale === 'bn' && product.nameBn ? product.nameBn : product.nameEn;
  const shortDesc = locale === 'bn' && product.shortDescBn ? product.shortDescBn : product.shortDescEn;
  const categoryName = category
    ? locale === 'bn' && category.nameBn
      ? category.nameBn
      : category.nameEn
    : locale === 'bn'
      ? 'মেশিনারি'
      : 'Machinery';
  const quoteHref = `/contact?product=${encodeURIComponent(name)}`;

  return (
    <article className="surface-card surface-card-hover overflow-hidden flex flex-col h-full group">
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer">
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-stone-800 text-[11px] font-medium rounded">
          {categoryName}
        </span>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-maroon transition-colors">
            {name}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {shortDesc}
        </p>

        {packables.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {packables.map((p) => (
              <span
                key={p.id}
                className="text-[11px] text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800 px-2 py-1 rounded border border-stone-100 dark:border-stone-700"
              >
                {locale === 'bn' ? p.nameBn : p.nameEn}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-5">
          <Link href={`/products/${product.slug}`} className="btn-secondary flex-1 text-[13px]">
            {t('products.viewDetails') || 'Details'}
          </Link>
          <Link href={quoteHref} className="btn-primary flex-1 text-[13px]">
            {t('products.quote') || 'Quote'}
          </Link>
        </div>
      </div>
    </article>
  );
}
