'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from '@/components/ProductCard';
import { packableItems, useCompany, useCatalogMap } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';
import { brochureHrefForProduct } from '@/data/brochure';
import { ChevronRight, ChevronLeft, X, MessageCircle, BookOpen, Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useLocale();
  const [company] = useCompany();
  const [catalogMap] = useCatalogMap();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [loading, setLoading] = useState(true);
  const isBn = locale === 'bn';
  const whatsapp = company?.whatsapp || '8801818496642';

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((p) => {
        setProduct(p);
        setActiveImage(0);
        if (p?.categoryId) {
          fetch('/api/products')
            .then((r) => r.json())
            .then((all: Product[]) => {
              setRelated(all.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 3));
            });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') setActiveImage((i) => i + 1);
      if (e.key === 'ArrowLeft') setActiveImage((i) => i - 1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-paper">
        <Loader2 className="w-10 h-10 text-brand-maroon animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-paper px-4">
        <h1 className="page-title text-2xl">{isBn ? 'মেশিন পাওয়া যায়নি' : 'Machine not found'}</h1>
        <Link href="/products" className="btn-primary">
          {isBn ? 'মেশিনারিতে ফিরুন' : 'Back to machinery'}
        </Link>
      </div>
    );
  }

  const category = product.category;
  let rawPackableIds: string[] = [];
  try {
    rawPackableIds = Array.isArray(product.packableIds)
      ? product.packableIds
      : JSON.parse(typeof product.packableIds === 'string' ? product.packableIds : '[]');
  } catch {
    rawPackableIds = [];
  }
  const packables = rawPackableIds
    .map((id) => packableItems.find((p) => p.id === id) || { id, nameEn: id, nameBn: id });
  const name = locale === 'bn' && product.nameBn ? product.nameBn : product.nameEn;
  const fullDesc = locale === 'bn' && product.fullDescBn ? product.fullDescBn : product.fullDescEn;
  const categoryName = category
    ? locale === 'bn' && category.nameBn
      ? category.nameBn
      : category.nameEn
    : 'Machinery';

  let images = ['/images/slider1.png'];
  try {
    const parsed = Array.isArray(product.images)
      ? product.images
      : JSON.parse(typeof product.images === 'string' ? product.images : '[]');
    if (parsed.length) images = parsed;
  } catch {
    images = ['/images/slider1.png'];
  }

  let specs: { keyEn: string; keyBn: string; value: string; unit?: string }[] = [];
  try {
    specs = Array.isArray(product.specs)
      ? product.specs
      : JSON.parse(typeof product.specs === 'string' ? product.specs : '[]');
  } catch {
    specs = [];
  }

  const imgIndex = ((activeImage % images.length) + images.length) % images.length;
  const quoteHref = `/contact?product=${encodeURIComponent(name)}`;
  const catalogHref = brochureHrefForProduct(product.slug, catalogMap);

  return (
    <div className="page-shell pb-16">
      <div className="brand-rule" aria-hidden="true" />
      <div className="border-b border-stone-200 dark:border-stone-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-maroon">
              {isBn ? 'হোম' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-brand-maroon">
              {isBn ? 'মেশিনারি' : 'Machinery'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-stone-900 dark:text-stone-200 truncate">{name}</span>
          </nav>
          <p className="section-kicker mb-2">{categoryName}</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="page-title max-w-3xl">{name}</h1>
            <div className="flex flex-wrap gap-2">
              <Link href={quoteHref} className="btn-primary">
                {t('products.requestQuote') || 'Request a quote'}
              </Link>
              {catalogHref && (
                <Link href={catalogHref} className="btn-secondary">
                  <BookOpen className="w-4 h-4" />
                  {isBn ? 'ক্যাটালগে দেখুন' : 'View in catalog'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-white border border-stone-200 dark:border-stone-800 cursor-zoom-in"
              aria-label={isBn ? 'ছবি বড় করে দেখুন' : 'Enlarge image'}
            >
              <Image src={images[imgIndex]} alt={name} fill className="object-contain bg-stone-50 dark:bg-stone-900" priority />
            </button>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border ${
                      imgIndex === i ? 'border-brand-maroon' : 'border-stone-200 dark:border-stone-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-8">
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-line">{fullDesc}</p>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
              <h2 className="px-5 py-3 text-sm font-semibold border-b border-stone-200 dark:border-stone-800">
                {t('products.specifications') || 'Specifications'}
              </h2>
              {specs.length === 0 ? (
                <p className="px-5 py-4 text-sm text-stone-500">
                  {isBn ? 'বিস্তারিত স্পেকসের জন্য কোটেশন চান।' : 'Ask for a quotation for detailed specifications.'}
                </p>
              ) : (
                <dl>
                  {specs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex justify-between gap-4 px-5 py-3 text-sm border-b border-stone-100 dark:border-stone-800 last:border-0"
                    >
                      <dt className="text-stone-500">{isBn ? spec.keyBn : spec.keyEn}</dt>
                      <dd className="font-medium text-stone-900 dark:text-white text-right">
                        {spec.value}
                        {spec.unit ? ` ${spec.unit}` : ''}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {packables.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-stone-900 dark:text-white mb-3">
                  {t('products.whatItPacks') || 'What this machine packs'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {packables.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products?q=${encodeURIComponent(isBn ? p.nameBn : p.nameEn)}`}
                      className="px-3 py-1.5 text-sm border border-stone-200 dark:border-stone-700 rounded-md hover:border-brand-maroon hover:text-brand-maroon"
                    >
                      {isBn ? p.nameBn : p.nameEn}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={quoteHref} className="btn-primary flex-1">
                {t('products.requestQuote') || 'Request a quote'}
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I am interested in ${name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {product.videoUrl && (
          <section className="mt-16">
            <h2 className="page-title text-2xl mb-5">{isBn ? 'ভিডিও' : 'Machine in operation'}</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-stone-200">
              <iframe
                src={product.videoUrl.includes('watch?v=') ? product.videoUrl.replace('watch?v=', 'embed/') : product.videoUrl}
                title={name}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4 mb-6">
              <h2 className="page-title text-2xl">{isBn ? 'সম্পর্কিত মেশিন' : 'Related machines'}</h2>
              <Link href="/products" className="btn-ghost text-sm">
                {isBn ? 'সব দেখুন' : 'All machinery'}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/92 flex flex-col" role="dialog" aria-modal="true" aria-label={name}>
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-sm truncate pr-4">
              {name} · {imgIndex + 1}/{images.length}
            </p>
            <button type="button" onClick={() => setLightbox(false)} className="p-3" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center p-4">
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImage((i) => i - 1)}
                className="absolute left-3 p-3 text-white/80 hover:text-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[imgIndex]} alt={name} className="max-h-full max-w-full object-contain" />
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImage((i) => i + 1)}
                className="absolute right-3 p-3 text-white/80 hover:text-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
