'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from './ProductCard';
import type { Category, Product } from '@/lib/api';
import { motion } from 'framer-motion';

interface ProductCategoryProps {
  category: Category;
  products: Product[];
}

export default function ProductCategory({ category, products }: ProductCategoryProps) {
  const { locale, t } = useLocale();
  
  if (!products || products.length === 0) return null;

  const title = locale === 'bn' ? category.descriptionBn || category.nameBn : category.descriptionEn || category.nameEn;
  const topProducts = products.slice(0, 4);

  return (
    <section className="py-10 sm:py-14 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Line and More button */}
        <motion.div 
          initial={{ opacity: 0, scaleX: 0.9 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          className="relative flex items-center mb-8"
        >
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <Link
            href={`/products?category=${category.slug}`}
            className="mx-4 px-6 py-2 bg-action-orange text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
          >
            {t('home.viewAll') || 'More Products'}
          </Link>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </motion.div>

        {/* Category Description / Title */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 max-w-4xl mx-auto"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-industrial-dark dark:text-white leading-relaxed">
            {title}
          </h2>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
