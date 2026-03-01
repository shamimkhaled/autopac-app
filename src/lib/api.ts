const API = process.env.NEXT_PUBLIC_SITE_URL || '';

function resolveApiBase(): string {
  if (typeof window === 'undefined') return API;
  if (!API) return '';
  if (API.startsWith('http://') && window.location.protocol === 'https:') {
    return API.replace(/^http:\/\//, 'https://');
  }
  return API;
}

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const base = resolveApiBase();
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  products: () => fetchAPI<Product[]>('/api/products'),
  product: (slug: string) => fetchAPI<Product | null>(`/api/products/${slug}`),
  categories: () => fetchAPI<Category[]>('/api/categories'),
  heroSlides: () => fetchAPI<HeroSlide[]>('/api/hero'),
  partners: () => fetchAPI<TrustedPartner[]>('/api/partners'),
  company: () => fetchAPI<CompanyProfile | null>('/api/company'),
  owner: () => fetchAPI<OwnerProfile | null>('/api/owner'),
  industries: () => fetchAPI<Industry[]>('/api/industries'),
  news: () => fetchAPI<NewsItem[]>('/api/news'),
};

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string;
  category: 'bangladesh' | 'international';
  thumbnail: string;
}

export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  imageUrl?: string;
}

export interface ProductSpec {
  keyEn: string;
  keyBn: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  category?: Category;
  nameEn: string;
  nameBn: string;
  shortDescEn: string;
  shortDescBn: string;
  fullDescEn: string;
  fullDescBn: string;
  images: string[];
  specs: ProductSpec[];
  packableIds: string[];
  videoUrl?: string;
  featured: boolean;
}

export interface HeroSlide {
  id: string;
  titleEn: string;
  titleBn: string;
  imageUrl: string;
  linkUrl?: string;
}

export interface TrustedPartner {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl?: string;
}

export interface CompanyProfile {
  id: string;
  logoUrl?: string | null;
  taglineEn?: string | null;
  taglineBn?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  officeHours?: string | null;
  mapEmbedUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  linkedinUrl?: string | null;
}

export interface OwnerProfile {
  id: string;
  nameEn: string;
  nameBn: string;
  titleEn: string;
  titleBn: string;
  photoUrl?: string;
  bioEn?: string;
  bioBn?: string;
  messageEn?: string;
  messageBn?: string;
}

export interface Industry {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
}
