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

  const name = locale === 'bn' ? product.nameBn : product.nameEn;
  const shortDesc = locale === 'bn' ? product.shortDescBn : product.shortDescEn;
  const categoryName = category ? (locale === 'bn' ? (category as { nameBn?: string }).nameBn : (category as { nameEn?: string }).nameEn) : '';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-industrial-light overflow-hidden">
          <Image
            src={(product.images || [])[0] || '/images/slider1.png'}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2">
            <span className="bg-action-orange text-white text-xs px-2 py-1 rounded">
              {categoryName}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-industrial-dark mb-2 line-clamp-2">{name}</h3>
          <p className="text-industrial-silver text-sm line-clamp-2 mb-3">{shortDesc}</p>
          {packables.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {packables.map((p) => (
                <span key={p!.id} className="text-xs bg-industrial-light text-industrial-charcoal px-2 py-0.5 rounded">
                  {locale === 'bn' ? p!.nameBn : p!.nameEn}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4 flex gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 text-center py-2 text-sm font-medium text-action-orange border border-action-orange rounded-lg hover:bg-action-orange hover:text-white transition"
        >
          {t('products.viewDetails')}
        </Link>
        <a
          href={`https://wa.me/8801818496642?text=${encodeURIComponent(`Hi, I am interested in ${name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
