'use client';

import { useEffect, useState } from 'react';
import type { Product, Category, HeroSlide, TrustedPartner, CompanyProfile, OwnerProfile, Industry, Testimonial } from '@/lib/api';
import { resolveApiBase } from '@/lib/api';
import { products as staticProducts, categories as staticCategories, packableItems } from '@/data/products';
import { DEFAULT_WEBSITE_CONTENT, type WebsiteContent } from '@/lib/siteContent';
import type { ProductBrochureMap } from '@/data/brochure';
import { PRODUCT_BROCHURE } from '@/data/brochure';

// Shared promise cache — ensures concurrent callers share one in-flight request
// instead of each firing their own fetch. Keyed by path.
const promiseCache = new Map<string, Promise<unknown>>();

async function fetchOrNull<T>(path: string): Promise<T | null> {
  try {
    const base = resolveApiBase();
    const res = await fetch(`${base}${path}`, {
      cache: 'no-store',
      headers: { Pragma: 'no-cache' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Treat { error: ... } payloads as failure so fallbacks kick in
    if (data && typeof data === 'object' && 'error' in data && Object.keys(data).length <= 2) {
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
}

function useFetch<T>(path: string, fallback: T): [T, boolean] {
  const [data, setData] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let pending = promiseCache.get(path) as Promise<T | null> | undefined;
    if (!pending) {
      pending = fetchOrNull<T>(path);
      promiseCache.set(path, pending);
      // Evict from cache after settlement so a future re-mount gets fresh data
      pending.finally(() => promiseCache.delete(path));
    }
    pending.then((d) => {
      if (d !== null) setData(d);
      setLoaded(true);
    });
  }, [path]);

  return [data, loaded];
}

export function useProducts() {
  const [api, loaded] = useFetch<Product[] | null>('/api/products', null);
  const catMap = Object.fromEntries(staticCategories.map((c) => [c.id, c]));
  if (api && Array.isArray(api)) {
    const withCats = api.map((p) => ({
      ...p,
      category: p.category || (catMap[p.categoryId] as Category | undefined),
    }));
    return [withCats, loaded] as const;
  }
  const mapped = staticProducts.map((p) => ({
    ...p,
    id: p.id,
    categoryId: p.categoryId,
    category: catMap[p.categoryId] as Category | undefined,
    fullDescEn: p.fullDescEn,
    fullDescBn: p.fullDescBn,
  }));
  return [mapped as Product[], loaded] as const;
}

export function useCatalogMap() {
  const [api, loaded] = useFetch<ProductBrochureMap | null>('/api/catalog-map', null);
  if (api && typeof api === 'object' && !Array.isArray(api)) {
    return [{ ...PRODUCT_BROCHURE, ...api }, loaded] as const;
  }
  return [PRODUCT_BROCHURE, loaded] as const;
}

export type CmsTranslationMap = Record<string, { en: string; bn: string }>;

export function useCmsTranslations() {
  return useFetch<CmsTranslationMap>('/api/translations', {});
}

export function useCategories() {
  const [api, loaded] = useFetch<Category[] | null>('/api/categories', null);
  if (api && api.length) return [api, loaded] as const;
  return [staticCategories as unknown as Category[], loaded] as const;
}

export function useHeroSlides() {
  const [api, loaded] = useFetch<HeroSlide[] | null>('/api/hero', null);
  if (api && api.length) return [api, loaded] as const;
  return [
    [
      { id: '1', titleEn: 'World Class Food Processing and Packaging Machinery', titleBn: 'বিশ্বমানের খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারি', imageUrl: '/images/slider1.png' },
      { id: '2', titleEn: 'Cosmetics, Unani product processing and packaging solution', titleBn: 'কসমেটিক্স, ইউনানী পণ্য প্রক্রিয়াকরণ ও প্যাকেজিং সমাধান', imageUrl: '/images/slider2.png' },
      { id: '3', titleEn: 'Water treatment plant & Filling and capping machine', titleBn: 'ওয়াটার ট্রিটমেন্ট প্ল্যান্ট ও ফিলিং এবং ক্যাপিং মেশিন', imageUrl: '/images/slider3.png' },
    ],
    loaded,
  ] as const;
}

export function usePartners() {
  const [api, loaded] = useFetch<TrustedPartner[] | null>('/api/partners', null);
  if (api && api.length) return [api, loaded] as const;
  return [
    [
      { id: '1', name: 'BSMTI', logoUrl: '', linkUrl: '#' },
      { id: '2', name: 'SME Foundation', logoUrl: '', linkUrl: '#' },
      { id: '3', name: 'Industry Partners', logoUrl: '', linkUrl: '#' },
      { id: '4', name: 'Exporters', logoUrl: '', linkUrl: '#' },
    ],
    loaded,
  ] as const;
}

export function useCompany() {
  const [api, loaded] = useFetch<CompanyProfile | null>('/api/company', null);
  const fallback: CompanyProfile = {
    id: '1',
    logoUrl: '/images/logo.png',
    taglineEn: 'World Class Food Processing and Packaging Machinery',
    taglineBn: 'বিশ্বমানের খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারি',
    address: '128/3 Kawran Bazar, Dhaka 1215, Bangladesh',
    phone: '01631769707, 01818496642',
    email: 'autopacbd@gmail.com',
    whatsapp: '8801818496642',
    website: 'www.autopacbd.com',
  };
  return [api || fallback, loaded] as const;
}

export function useOwner() {
  return useFetch<OwnerProfile | null>('/api/owner', null);
}

export function useIndustries() {
  const [api, loaded] = useFetch<Industry[] | null>('/api/industries', null);
  if (api && api.length) return [api, loaded] as const;
  const fallback: Industry[] = [
    { id: '1', slug: 'food-beverage', nameEn: 'Food & Beverage', nameBn: 'খাদ্য ও পানীয়', descriptionEn: '', descriptionBn: '' },
    { id: '2', slug: 'pharmaceutical', nameEn: 'Pharmaceutical', nameBn: 'ফার্মাসিউটিক্যাল', descriptionEn: '', descriptionBn: '' },
    { id: '3', slug: 'cosmetics', nameEn: 'Cosmetics & Toiletries', nameBn: 'কসমেটিক্স ও টয়লেট্রিজ', descriptionEn: '', descriptionBn: '' },
    { id: '4', slug: 'industrial', nameEn: 'Industrial & Other', nameBn: 'ইন্ডাস্ট্রিয়াল ও অন্যান্য', descriptionEn: '', descriptionBn: '' },
  ];
  return [api || fallback, loaded] as const;
}

export function useTestimonials() {
  const [api, loaded] = useFetch<Testimonial[] | null>('/api/testimonials', null);
  return [Array.isArray(api) ? api : [], loaded] as const;
}

export function useWebsiteContent() {
  const [api, loaded] = useFetch<WebsiteContent | null>('/api/site-content', null);
  return [api || DEFAULT_WEBSITE_CONTENT, loaded] as const;
}

export interface SiteStatRow {
  id: string;
  labelEn: string;
  labelBn: string;
  value: string;
  icon?: string;
  sortOrder?: number;
}

export function useSiteStats() {
  const [api, loaded] = useFetch<SiteStatRow[] | null>('/api/stats', null);
  const fallback: SiteStatRow[] = [
    { id: '1', labelEn: 'Years in Dhaka', labelBn: 'বছর ঢাকায়', value: '35+' },
    { id: '2', labelEn: 'Machines delivered', labelBn: 'মেশিন সরবরাহ', value: '500+' },
    { id: '3', labelEn: 'Factory clients', labelBn: 'কারখানা', value: '300+' },
    { id: '4', labelEn: 'Product lines', labelBn: 'পণ্য লাইন', value: '16' },
  ];
  return [Array.isArray(api) && api.length ? api : fallback, loaded] as const;
}

export { packableItems };
