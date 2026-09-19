'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from './ProductCard';
import type { Category, Product } from '@/lib/api';
import { ArrowRight } from 'lucide-react';

interface ProductCategoryProps {
  category: Category;
  products: Product[];
}

export default function ProductCategory({ category, products }: ProductCategoryProps) {
  const { locale } = useLocale();

  if (!products || products.length === 0) return null;

  const title = locale === 'bn' ? category.nameBn : category.nameEn;
  const description = locale === 'bn' ? category.descriptionBn : category.descriptionEn;
  const topProducts = products.slice(0, 4);

  return (
    <section className="py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="section-kicker mb-2">{locale === 'bn' ? 'ক্যাটাগরি' : 'Category'}</p>
            <h2 className="page-title text-2xl sm:text-3xl">{title}</h2>
            {description && (
              <p className="mt-2 text-stone-600 dark:text-stone-400 max-w-2xl text-sm">{description}</p>
            )}
          </div>
          <Link href={`/products?category=${category.slug}`} className="btn-ghost text-sm">
            {locale === 'bn' ? 'সব দেখুন' : 'View range'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
