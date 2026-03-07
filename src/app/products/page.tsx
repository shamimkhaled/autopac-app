'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from '@/components/ProductCard';
import { useProducts, useCategories } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = searchParams.get('category');
  const pageParam = searchParams.get('page');
  
  const { t, locale } = useLocale();
  const [products] = useProducts();
  const [categories] = useCategories();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Search and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const ITEMS_PER_PAGE = 12;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm) {
        handlePageChange(1); // Reset to page 1 on new search
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
    setMobileFilterOpen(false);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (categorySlug) {
      filtered = filtered.filter((p: Product) => {
        const cat = p.category || categories.find((c: { id: string }) => c.id === p.categoryId);
        return cat && (cat as { slug?: string }).slug === categorySlug;
      });
    }

    if (debouncedSearchTerm) {
      const lowerQuery = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((p: Product) => {
        return (p.nameEn?.toLowerCase().includes(lowerQuery)) || 
               (p.nameBn?.toLowerCase().includes(lowerQuery)) ||
               (p.shortDescEn?.toLowerCase().includes(lowerQuery)) ||
               (p.shortDescBn?.toLowerCase().includes(lowerQuery));
      });
    }

    return filtered;
  }, [categorySlug, products, categories, debouncedSearchTerm]);

  const currentCategory = categorySlug ? categories.find((c: { slug: string }) => c.slug === categorySlug) : null;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Page header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-10 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-industrial-dark dark:text-white"
          >
            {t('products.title') || 'Our Machinery Portfolio'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
          >
            {currentCategory 
              ? (locale === 'bn' ? currentCategory.nameBn : currentCategory.nameEn)
              : 'Explore our wide range of industrial processing and packaging equipment.'}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 -mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Categories & Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              
              {/* Search Box */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative z-10">
                <h3 className="font-bold text-industrial-dark dark:text-white mb-4 text-lg">Search</h3>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search by name or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-action-orange focus:border-transparent transition-all text-industrial-dark dark:text-white"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10">
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden w-full flex items-center justify-between p-5 font-bold text-lg text-industrial-dark dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-action-orange" />
                    {t('products.categories') || 'Categories'}
                  </span>
                  <ChevronRight className={`w-5 h-5 transition-transform ${mobileFilterOpen ? 'rotate-90' : ''}`} />
                </button>
                
                <div className={`${mobileFilterOpen ? 'block' : 'hidden'} lg:block p-5 lg:pt-5 border-t lg:border-t-0 border-gray-100 dark:border-gray-700`}>
                  <h3 className="font-bold text-industrial-dark dark:text-white mb-4 text-lg hidden lg:flex items-center gap-2">
                    <Filter className="w-5 h-5 text-action-orange" />
                    {t('products.categories') || 'Categories'}
                  </h3>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className={`w-full text-left py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-between ${
                        !categorySlug 
                          ? 'bg-action-orange text-white shadow-md shadow-orange-500/20' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      {t('products.allProducts') || 'All Categories'}
                      {!categorySlug && <ChevronRight className="w-4 h-4" />}
                    </button>
                    {categories.map((cat: { id: string; slug: string; nameEn: string; nameBn: string }) => {
                      const isActive = categorySlug === cat.slug;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryChange(cat.slug)}
                          className={`w-full text-left py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-between ${
                            isActive 
                              ? 'bg-action-orange text-white shadow-md shadow-orange-500/20' 
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          {locale === 'bn' ? cat.nameBn : cat.nameEn}
                          {isActive && <ChevronRight className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Active Filters Bar */}
            {(categorySlug || searchTerm) && (
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Filters:</span>
                {categorySlug && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-industrial-dark dark:text-white shadow-sm">
                    {currentCategory ? (locale === 'bn' ? currentCategory.nameBn : currentCategory.nameEn) : categorySlug}
                    <button onClick={() => handleCategoryChange(null)} className="hover:text-action-orange ml-1"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-industrial-dark dark:text-white shadow-sm">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:text-action-orange ml-1"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
              </div>
            )}

            {paginatedProducts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 lg:p-20 text-center flex flex-col items-center justify-center flex-grow">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-industrial-dark dark:text-white mb-2">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  We couldn't find any products matching your current filters. Try adjusting your search or category selection.
                </p>
                <button 
                  onClick={() => {
                    handleCategoryChange(null);
                    setSearchTerm('');
                  }}
                  className="px-6 py-3 bg-action-orange text-white font-medium rounded-full hover:bg-orange-600 transition-colors shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-bold text-industrial-dark dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="font-bold text-industrial-dark dark:text-white">{filteredProducts.length}</span> products
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-grow">
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product: Product, index: number) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Modern Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2 overflow-x-auto pb-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1.5 px-2 flex-wrap justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        // Show first, last, current, and adjacent pages
                        if (
                          pageNum === 1 || 
                          pageNum === totalPages || 
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                                currentPage === pageNum
                                  ? 'bg-action-orange text-white shadow-md shadow-orange-500/20'
                                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 || 
                          pageNum === currentPage + 2
                        ) {
                          return <span key={pageNum} className="text-gray-400">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-action-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
