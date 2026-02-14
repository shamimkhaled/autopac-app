'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from '@/components/ProductCard';
import { packableItems } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useLocale();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-industrial-silver">Loading...</p>
        </div>
      </div>
    );
  }

  const category = product.category;
  const packables = (product.packableIds || []).map((id: string) => packableItems.find((p) => p.id === id)).filter(Boolean);
  const name = locale === 'bn' ? product.nameBn : product.nameEn;
  const fullDesc = locale === 'bn' ? product.fullDescBn : product.fullDescEn;

  return (
    <div className="min-h-screen bg-industrial-light pb-24 md:pb-8">
      <div className="bg-industrial-dark text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/products" className="text-action-orange hover:underline text-sm mb-2 inline-block">
            ← {t('products.title')}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          {category && (
            <span className="text-white/80 text-sm">{locale === 'bn' ? (category as { nameBn?: string }).nameBn : (category as { nameEn?: string }).nameEn}</span>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-lg">
              <Image src={(product.images || [])[0] || '/images/slider1.png'} alt={name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            {(product.images || []).length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images!.map((img: string, i: number) => (
                  <div key={i} className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-industrial-charcoal leading-relaxed mb-8">{fullDesc}</p>

            {(product.specs || []).length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-industrial-dark text-lg mb-4">{t('products.specifications')}</h3>
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {product.specs!.map((spec: { keyEn: string; keyBn: string; value: string; unit?: string }, i: number) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-industrial-light' : ''}>
                          <td className="py-3 px-4 font-medium text-industrial-charcoal">{locale === 'bn' ? spec.keyBn : spec.keyEn}</td>
                          <td className="py-3 px-4 text-industrial-silver">{spec.value} {spec.unit || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {packables.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-industrial-dark text-lg mb-4">{t('products.whatItPacks')}</h3>
                <div className="flex flex-wrap gap-2">
                  {packables.map((p) => (
                    <span key={p!.id} className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow text-sm text-industrial-charcoal">
                      {locale === 'bn' ? p!.nameBn : p!.nameEn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.videoUrl && (
              <div className="mb-8">
                <h3 className="font-bold text-industrial-dark text-lg mb-4">Video</h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-industrial-charcoal">
                  <iframe src={product.videoUrl} title={name} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/contact?product=${product.slug}`} className="flex-1 text-center py-4 bg-action-orange hover:bg-action-orange-dark text-white font-bold rounded-lg transition">
                {t('products.requestQuote')}
              </Link>
              <a href={`https://wa.me/8801818496642?text=${encodeURIComponent(`Hi, I am interested in ${name}. Please send me a quote.`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                {t('products.inquireWhatsApp')}
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-industrial-dark mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
