'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import { useCategories } from '@/hooks/useSiteData';
import { packableItems } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { locale, t } = useLocale();
  const [categories] = useCategories();
  const category = product.category || categories.find((c: { id: string }) => c.id === product.categoryId);
  const packables = (product.packableIds || [])
    .slice(0, 4)
    .map((id: string) => packableItems.find((p) => p.id === id))
    .filter(Boolean);

  const name = locale === 'bn' && product.nameBn ? product.nameBn : product.nameEn;
  const shortDesc = locale === 'bn' && product.shortDescBn ? product.shortDescBn : product.shortDescEn;
  const categoryName = category ? (locale === 'bn' && (category as { nameBn?: string }).nameBn ? (category as { nameBn?: string }).nameBn : (category as { nameEn?: string }).nameEn) : '';

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 group border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <Link href={`/products/${product.slug}`} className="block flex-grow">
        <div className="relative aspect-[4/3] bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <Image
            src={(product.images || [])[0] || '/images/slider1.png'}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          {categoryName && (
            <span className="absolute top-4 left-4 bg-industrial-dark/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
              {categoryName}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-bold text-industrial-dark dark:text-white mb-2 line-clamp-2 text-lg group-hover:text-action-orange transition-colors">{name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">{shortDesc}</p>
          {packables.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {packables.map((p) => (
                <span key={p!.id} className="text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">
                  {locale === 'bn' ? p!.nameBn : p!.nameEn}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      <div className="p-5 pt-0 mt-auto flex flex-col xs:flex-row gap-3">
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 text-center py-2.5 text-sm font-bold text-industrial-dark dark:text-white bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {t('products.viewDetails') || 'Details'}
        </Link>
        <a
          href={`https://wa.me/8801818496642?text=${encodeURIComponent(`Hi, I am interested in ${name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-2.5 text-sm font-bold bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-500/20"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          WhatsApp
        </a>
      </div>
    </article>
  );
}
