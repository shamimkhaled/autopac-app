'use client';

import { useEffect, useState } from 'react';
import type { Product, Category, HeroSlide, TrustedPartner, CompanyProfile, OwnerProfile, Industry } from '@/lib/api';
import { products as staticProducts, categories as staticCategories, packableItems } from '@/data/products';

const API = process.env.NEXT_PUBLIC_SITE_URL || '';

async function fetchOrNull<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function useFetch<T>(path: string, fallback: T): [T, boolean] {
  const [data, setData] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchOrNull<T>(path).then((d) => {
      if (d !== null) setData(d);
      setLoaded(true);
    });
  }, [path]);

  return [data, loaded];
}

export function useProducts() {
  const [api, loaded] = useFetch<Product[] | null>('/api/products', null);
  if (api && Array.isArray(api)) return [api, loaded] as const;
  const mapped = staticProducts.map((p) => ({
    ...p,
    id: p.id,
    categoryId: p.categoryId,
    fullDescEn: p.fullDescEn,
    fullDescBn: p.fullDescBn,
  }));
  return [mapped as Product[], loaded] as const;
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

export { packableItems };
