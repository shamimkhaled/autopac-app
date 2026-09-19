'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from '@/components/ProductCard';
import { useProducts, useCategories, useCatalogMap, packableItems } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';
import { BROCHURE_LINES, productSlugsForLine } from '@/data/brochure';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHero from '@/components/PageHero';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = searchParams.get('category');
  const lineParam = searchParams.get('line');
  const qParam = searchParams.get('q') || '';
  const pageParam = searchParams.get('page');

  const { t, locale } = useLocale();
  const [products] = useProducts();
  const [categories] = useCategories();
  const [catalogMap] = useCatalogMap();
  const [searchTerm, setSearchTerm] = useState(qParam);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(qParam);
  const [mobileFilters, setMobileFilters] = useState(false);

  const ITEMS_PER_PAGE = 12;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const isBn = locale === 'bn';

  useEffect(() => {
    setSearchTerm(qParam);
    setDebouncedSearchTerm(qParam);
  }, [qParam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const pushParams = (next: { category?: string | null; line?: string | null; q?: string | null; page?: number }) => {
    const params = new URLSearchParams();
    const category = next.category === undefined ? categorySlug : next.category;
    const line = next.line === undefined ? lineParam : next.line;
    const q = next.q === undefined ? searchTerm : next.q;
    const page = next.page ?? 1;
    if (category) params.set('category', category);
    if (line) params.set('line', line);
    if (q?.trim()) params.set('q', q.trim());
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (categorySlug) {
      filtered = filtered.filter((p: Product) => {
        const cat = p.category || categories.find((c) => c.id === p.categoryId);
        return cat && cat.slug === categorySlug;
      });
    }

    if (lineParam) {
      const slugs = productSlugsForLine(lineParam, catalogMap);
      filtered = filtered.filter((p) => slugs.includes(p.slug));
    }

    if (debouncedSearchTerm) {
      const q = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((p: Product) => {
        const rawIds = Array.isArray(p.packableIds)
          ? p.packableIds
          : typeof p.packableIds === 'string'
            ? (() => {
                try {
                  return JSON.parse(p.packableIds as unknown as string);
                } catch {
                  return [];
                }
              })()
            : [];
        const packableHit = rawIds.some((id: string) => {
          const item = packableItems.find((x) => x.id === id);
          return (
            id.toLowerCase().includes(q) ||
            item?.nameEn.toLowerCase().includes(q) ||
            item?.nameBn.includes(q)
          );
        });
        return (
          p.nameEn?.toLowerCase().includes(q) ||
          p.nameBn?.toLowerCase().includes(q) ||
          p.shortDescEn?.toLowerCase().includes(q) ||
          p.shortDescBn?.toLowerCase().includes(q) ||
          packableHit
        );
      });
    }

    return filtered;
  }, [categorySlug, lineParam, products, categories, debouncedSearchTerm, catalogMap]);

  const suggestions = useMemo(() => {
    if (searchTerm.trim().length < 2) return [];
    const q = searchTerm.toLowerCase();
    return products
      .filter(
        (p) =>
          p.nameEn.toLowerCase().includes(q) ||
          p.nameBn.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchTerm, products]);

  const currentCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null;
  const currentLine = lineParam
    ? BROCHURE_LINES.find((l) => l.id === lineParam)
    : null;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-3">
          {t('products.categories') || 'Categories'}
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => pushParams({ category: null, page: 1 })}
            className={`w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer ${
              !categorySlug
                ? 'bg-brand-maroon text-white'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            {t('products.allProducts') || 'All machinery'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => pushParams({ category: cat.slug, page: 1 })}
              className={`w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer ${
                categorySlug === cat.slug
                  ? 'bg-brand-maroon text-white'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              {isBn ? cat.nameBn : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-3">
          {isBn ? 'প্রোডাক্ট লাইন' : 'Product lines'}
        </h3>
        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
          {BROCHURE_LINES.map((line) => (
            <button
              key={line.id}
              type="button"
              onClick={() =>
                pushParams({ line: lineParam === line.id ? null : line.id, page: 1 })
              }
              className={`w-full text-left px-3 py-2 rounded-md text-[13px] leading-snug cursor-pointer ${
                lineParam === line.id
                  ? 'bg-brand-maroon text-white'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <span className="opacity-70 mr-1">{line.number}</span>
              {isBn ? line.shortBn : line.shortEn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <PageHero
        kicker={isBn ? 'মেশিনারি' : 'Machinery'}
        title={
          currentLine
            ? isBn
              ? currentLine.titleBn
              : currentLine.titleEn
            : currentCategory
              ? isBn
                ? currentCategory.nameBn
                : currentCategory.nameEn
              : t('products.title') || 'Packaging and processing machines'
        }
        description={
          isBn
            ? 'নাম, ক্যাটাগরি বা প্যাকযোগ্য পণ্য দিয়ে খুঁজুন। ক্যাটালগ পৃষ্ঠা থেকেও মেশিনে আসা যায়।'
            : 'Search by machine name, category, or the product it packs. Catalog pages also lead here.'
        }
        actions={
          <Link href="/brochure" className="btn-secondary">
            {isBn ? 'অফিসিয়াল ক্যাটালগ' : 'Open official catalog'}
          </Link>
        }
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') pushParams({ q: searchTerm, page: 1 });
                  }}
                  placeholder={t('products.searchPlaceholder') || 'Search machines or packed products'}
                  className="w-full h-11 pl-9 pr-9 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/30 focus:border-brand-maroon"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      pushParams({ q: '', page: 1 });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {suggestions.length > 0 && searchTerm !== debouncedSearchTerm && (
                  <ul className="absolute z-20 mt-1 w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md overflow-hidden">
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.slug}`}
                          className="block px-3 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800"
                        >
                          {isBn ? p.nameBn : p.nameEn}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                className="lg:hidden w-full btn-secondary"
                onClick={() => setMobileFilters((v) => !v)}
              >
                {isBn ? 'ফিল্টার' : 'Filters'}
              </button>
              <div className={`${mobileFilters ? 'block' : 'hidden'} lg:block bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4`}>
                {filterPanel}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {(categorySlug || lineParam || searchTerm) && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {categorySlug && currentCategory && (
                  <button
                    type="button"
                    onClick={() => pushParams({ category: null, page: 1 })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full text-sm"
                  >
                    {isBn ? currentCategory.nameBn : currentCategory.nameEn}
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {currentLine && (
                  <button
                    type="button"
                    onClick={() => pushParams({ line: null, page: 1 })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full text-sm"
                  >
                    {isBn ? currentLine.titleBn : currentLine.titleEn}
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {searchTerm && (
                  <span className="text-sm text-stone-500">
                    “{searchTerm}”
                  </span>
                )}
              </div>
            )}

            {paginatedProducts.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-12 text-center">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-white">
                  {t('products.noProducts') || 'No machines found'}
                </h3>
                <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto">
                  {t('products.noProductsDesc') ||
                    'Try another keyword, or browse the official catalog for the full machinery range.'}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      router.push('/products');
                    }}
                    className="btn-primary"
                  >
                    {t('products.clearFilters') || 'Clear filters'}
                  </button>
                  <Link href="/brochure" className="btn-secondary">
                    {isBn ? 'ক্যাটালগ দেখুন' : 'Browse catalog'}
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-stone-500 mb-5">
                  {filteredProducts.length}{' '}
                  {isBn ? 'টি মেশিন' : filteredProducts.length === 1 ? 'machine' : 'machines'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center items-center gap-2">
                    <button
                      type="button"
                      onClick={() => pushParams({ page: page - 1 })}
                      disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-md border border-stone-200 dark:border-stone-700 disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-stone-600 px-2">
                      {page} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => pushParams({ page: page + 1 })}
                      disabled={page === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-md border border-stone-200 dark:border-stone-700 disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-paper">
          <div className="w-10 h-10 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
