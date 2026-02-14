'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from '@/components/ProductCard';
import { useProducts, useCategories } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  const { t, locale } = useLocale();
  const [products] = useProducts();
  const [categories] = useCategories();

  const filteredProducts = useMemo(() => {
    if (!categorySlug) return products;
    return products.filter((p: Product) => {
      const cat = p.category || categories.find((c: { id: string }) => c.id === p.categoryId);
      return cat && (cat as { slug?: string }).slug === categorySlug;
    });
  }, [categorySlug, products, categories]);

  const currentCategory = categorySlug ? categories.find((c: { slug: string }) => c.slug === categorySlug) : null;

  return (
    <div className="min-h-screen bg-industrial-light">
      <div className="bg-industrial-dark text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t('products.title')}</h1>
          {currentCategory && (
            <p className="mt-2 text-white/80">{locale === 'bn' ? currentCategory.nameBn : currentCategory.nameEn}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow p-4 sticky top-24">
              <h3 className="font-bold text-industrial-dark mb-4">{t('products.categories')}</h3>
              <nav className="space-y-1">
                <a href="/products" className={`block py-2 px-3 rounded-lg transition ${!categorySlug ? 'bg-action-orange text-white' : 'hover:bg-industrial-light'}`}>
                  {t('products.allProducts')}
                </a>
                {categories.map((cat: { id: string; slug: string; nameEn: string; nameBn: string }) => (
                  <a key={cat.id} href={`/products?category=${cat.slug}`} className={`block py-2 px-3 rounded-lg transition ${categorySlug === cat.slug ? 'bg-action-orange text-white' : 'hover:bg-industrial-light'}`}>
                    {locale === 'bn' ? cat.nameBn : cat.nameEn}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center text-industrial-silver">{t('products.noProducts')}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
