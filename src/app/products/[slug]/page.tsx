'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from '@/components/ProductCard';
import { packableItems } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, MessageCircle, FileText, ChevronLeft, ArrowLeft, PlayCircle } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useLocale();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${slug}`).then((r) => r.json()).then((p) => {
      setProduct(p);
      if (p?.categoryId) {
        fetch('/api/products').then((r) => r.json()).then((all: Product[]) => {
          setRelated(all.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4));
        });
      }
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-action-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const category = product.category;
  const packables = (product.packableIds || []).map((id: string) => packableItems.find((p) => p.id === id)).filter(Boolean);
  const name = locale === 'bn' && product.nameBn ? product.nameBn : product.nameEn;
  const fullDesc = locale === 'bn' && product.fullDescBn ? product.fullDescBn : product.fullDescEn;
  const categoryName = category ? (locale === 'bn' && (category as { nameBn?: string }).nameBn ? (category as { nameBn?: string }).nameBn : (category as { nameEn?: string }).nameEn) : null;
  const images = product.images || ['/images/slider1.png'];

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 md:pb-16 transition-colors duration-300">
      
      {/* Breadcrumbs & Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-8 pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-4 overflow-x-auto whitespace-nowrap pb-2 text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-action-orange transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link href="/products" className="hover:text-action-orange transition-colors">{t('products.title') || 'Products'}</Link>
            {category && (
              <>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                <Link href={`/products?category=${(category as { slug?: string }).slug}`} className="hover:text-action-orange transition-colors">
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-industrial-dark dark:text-white font-medium truncate max-w-xs">{name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Image Gallery Section */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={images[activeImage]} 
                    alt={`${name} - View ${activeImage + 1}`} 
                    fill 
                    className="object-contain p-4" 
                    priority 
                    sizes="(max-width: 1024px) 100vw, 50vw" 
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Category Badge overlay */}
              {categoryName && (
                <span className="absolute top-6 left-6 bg-industrial-dark/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-md">
                  {categoryName}
                </span>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-black/50 hover:bg-action-orange dark:hover:bg-action-orange text-industrial-dark hover:text-white dark:text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-lg">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-black/50 hover:bg-action-orange dark:hover:bg-action-orange text-industrial-dark hover:text-white dark:text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-lg">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden transition-all bg-white dark:bg-gray-800 ${
                    activeImage === i 
                      ? 'ring-2 ring-action-orange ring-offset-2 dark:ring-offset-gray-900 shadow-md' 
                      : 'border border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-contain p-2" sizes="96px" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-industrial-dark dark:text-white mb-6 leading-tight">
              {name}
            </h1>
            
            <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-none">
              <p>{fullDesc}</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                href={`/contact?product=${product.slug}`} 
                className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-action-orange hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5" />
                {t('products.requestQuote') || 'Request Quotation'}
              </Link>
              <a 
                href={`https://wa.me/8801818496642?text=${encodeURIComponent(`Hi, I am interested in ${name}. Please send me a quote.`)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                {t('products.inquireWhatsApp') || 'WhatsApp Inquiry'}
              </a>
            </div>

            {/* Specifications */}
            {(product.specs || []).length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-industrial-dark dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <div className="w-3 h-3 bg-action-orange rounded-sm" />
                  </div>
                  {t('products.specifications') || 'Technical Specifications'}
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {product.specs!.map((spec: { keyEn: string; keyBn: string; value: string; unit?: string }, i: number) => (
                        <tr key={i} className={`border-b border-gray-100 dark:border-gray-700 last:border-0 ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}`}>
                          <th className="py-4 px-6 font-semibold text-industrial-dark dark:text-gray-200 w-1/3 border-r border-gray-100 dark:border-gray-700">
                            {locale === 'bn' ? spec.keyBn : spec.keyEn}
                          </th>
                          <td className="py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">
                            {spec.value} {spec.unit && <span className="text-gray-400 ml-1">{spec.unit}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Packable Items */}
            {packables.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-industrial-dark dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  {t('products.whatItPacks') || 'Suitable For Packing'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {packables.map((p) => (
                    <span 
                      key={p!.id} 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-industrial-dark dark:text-white font-medium rounded-xl shadow-sm"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      {locale === 'bn' ? p!.nameBn : p!.nameEn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Video Showcase Section */}
        {product.videoUrl && (
          <section className="mt-20 pt-16 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-industrial-dark dark:text-white mb-4">Video Showcase</h2>
                <p className="text-gray-600 dark:text-gray-400">See the {name} in action.</p>
              </div>
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-black">
                <iframe 
                  src={product.videoUrl.includes('watch?v=') ? product.videoUrl.replace('watch?v=', 'embed/') : product.videoUrl} 
                  title={`${name} Video Showcase`}
                  className="w-full h-full" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                />
              </div>
            </div>
          </section>
        )}

        {/* Recommended Products */}
        {related.length > 0 && (
          <section className="mt-20 pt-16 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-bold text-industrial-dark dark:text-white">Recommended Products</h2>
              <Link href={`/products?category=${(category as { slug?: string })?.slug}`} className="hidden sm:inline-flex items-center gap-2 text-action-orange font-bold hover:underline">
                View Category <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href={`/products?category=${(category as { slug?: string })?.slug}`} className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full font-bold text-industrial-dark dark:text-white shadow-sm">
                View All in Category
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
