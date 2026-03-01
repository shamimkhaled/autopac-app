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
import { Check, ChevronRight, MessageCircle, FileText, ChevronLeft, ArrowLeft, PlayCircle, Settings, ShieldCheck, Box, Package, ArrowRight, Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useLocale();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((p) => {
        setProduct(p);
        if (p?.categoryId) {
          fetch('/api/products')
            .then((r) => r.json())
            .then((all: Product[]) => {
              setRelated(all.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4));
            });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const category = product.category;
  let rawPackableIds = [];
  try {
    rawPackableIds = Array.isArray(product.packableIds) ? product.packableIds : JSON.parse(typeof product.packableIds === 'string' ? product.packableIds : '[]');
  } catch (e) {
    console.error(`Error parsing packableIds for product ${product.id}:`, e);
  }
  const packables = rawPackableIds.map((id: string) => packableItems.find((p) => p.id === id) || { id, nameEn: id, nameBn: id }).filter(Boolean);
  const name = locale === 'bn' && product.nameBn ? product.nameBn : product.nameEn;
  const fullDesc = locale === 'bn' && product.fullDescBn ? product.fullDescBn : product.fullDescEn;
  const categoryName = category ? (locale === 'bn' && (category as any).nameBn ? (category as any).nameBn : (category as any).nameEn) : 'Machinery';
  
  let images = ['/images/slider1.png'];
  try {
    images = Array.isArray(product.images) ? product.images : JSON.parse(typeof product.images === 'string' ? product.images : '["/images/slider1.png"]');
  } catch (e) {
    console.error(`Error parsing images for product ${product.id}:`, e);
  }

  let specs = [] as { keyEn: string; keyBn: string; value: string; unit?: string }[];
  try {
    specs = Array.isArray(product.specs) ? product.specs : JSON.parse(typeof product.specs === 'string' ? product.specs : '[]') as { keyEn: string; keyBn: string; value: string; unit?: string }[];
  } catch (e) {
    console.error(`Error parsing specs for product ${product.id}:`, e);
  }

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Breadcrumbs & Modern Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-gray-400">
            <Link href="/" className="hover:text-action-orange transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/products" className="hover:text-action-orange transition-colors">Catalog</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-industrial-dark truncate max-w-xs">{name}</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-0.5 bg-action-orange rounded-full" />
                <span className="text-action-orange font-black uppercase tracking-[0.2em] text-[10px]">
                  {categoryName}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-industrial-dark uppercase tracking-tight leading-tight">
                {name}
              </h1>
            </div>
            <div className="flex gap-4">
              <Link 
                href={`/contact?product=${product.slug}`}
                className="px-8 py-4 bg-action-orange text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-action-orange/20 hover:bg-orange-600 transition-all"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-20">
          
          {/* Left: Image Gallery (7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[4/3] rounded-[60px] overflow-hidden bg-gray-50 border border-gray-100 shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={images[activeImage]} 
                    alt={name} 
                    fill 
                    className="object-cover" 
                    priority 
                  />
                </motion.div>
              </AnimatePresence>
              
              {images.length > 1 && (
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button onClick={prevImage} className="pointer-events-auto w-14 h-14 bg-white/10 backdrop-blur-xl hover:bg-white text-white hover:text-industrial-dark rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/20">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={nextImage} className="pointer-events-auto w-14 h-14 bg-white/10 backdrop-blur-xl hover:bg-white text-white hover:text-industrial-dark rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/20">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-2">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-3xl overflow-hidden transition-all duration-500 ${
                    activeImage === i 
                      ? 'ring-4 ring-action-orange ring-offset-4 scale-110 shadow-xl' 
                      : 'border-2 border-gray-100 opacity-40 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Technical Details (5 columns) */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Industrial Certified Model</span>
              </div>
              
              <div className="prose prose-lg text-gray-500 font-medium leading-relaxed max-w-none">
                <p className="whitespace-pre-line">{fullDesc}</p>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="space-y-8 bg-gray-50 rounded-[40px] p-10 border border-gray-100">
              <h3 className="text-xl font-black text-industrial-dark uppercase tracking-tight flex items-center gap-4">
                <Settings className="w-6 h-6 text-action-orange" />
                Technical Specs
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {specs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {locale === 'bn' ? spec.keyBn : spec.keyEn}
                    </span>
                    <span className="text-industrial-dark font-black">
                      {spec.value} <span className="text-gray-400 font-medium ml-1">{spec.unit}</span>
                    </span>
                  </div>
                ))}
                {specs.length === 0 && <p className="text-gray-400 italic text-sm">Consult our engineers for detailed specs.</p>}
              </div>
            </div>

            {/* Packables */}
            {packables.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-xl font-black text-industrial-dark uppercase tracking-tight flex items-center gap-4">
                  <Box className="w-6 h-6 text-action-orange" />
                  Compatible Materials
                </h3>
                <div className="flex flex-wrap gap-3">
                  {packables.map((p: any) => (
                    <span key={p.id} className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-bold text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      {locale === 'bn' ? p.nameBn : p.nameEn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Inquire Action */}
            <div className="pt-8">
              <a 
                href={`https://wa.me/8801818496642?text=${encodeURIComponent(`Hi, I am interested in ${name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group flex items-center justify-between p-8 bg-industrial-dark text-white rounded-[40px] hover:bg-black transition-all shadow-2xl relative overflow-hidden"
              >
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-action-orange uppercase tracking-[0.2em] mb-2">Live Support</p>
                  <h4 className="text-2xl font-black uppercase tracking-tight">Deploy Inquiry</h4>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-action-orange transition-all relative z-10">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-12 translate-x-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {product.videoUrl && (
          <section className="mt-40 py-32 bg-gray-50 rounded-[80px] px-8 md:px-20 border border-gray-100">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-black text-industrial-dark uppercase tracking-tight leading-tight">
                    Performance <span className="text-gray-300">Showcase</span>
                  </h2>
                  <div className="w-20 h-2 bg-action-orange rounded-full" />
                </div>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                  Witness the high-speed precision and automated workflow of the {name} in a real-world production environment.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-4">
                    {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200" />)}
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Trusted by 200+ Manufacturers</p>
                </div>
              </div>
              <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl border-[12px] border-white bg-black">
                <iframe 
                  src={product.videoUrl.includes('watch?v=') ? product.videoUrl.replace('watch?v=', 'embed/') : product.videoUrl} 
                  title="Showcase"
                  className="w-full h-full" 
                  allowFullScreen 
                />
              </div>
            </div>
          </section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-40">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-0.5 bg-action-orange rounded-full" />
                  <span className="text-action-orange font-black uppercase tracking-[0.2em] text-[10px]">Similar Systems</span>
                </div>
                <h2 className="text-4xl font-black text-industrial-dark uppercase tracking-tight">Recommended Solutions</h2>
              </div>
              <Link href="/products" className="group flex items-center gap-3 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-industrial-dark transition-colors">
                View Full Catalog <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
