import { categories, products } from '@/data/products';
import type { Product } from '@/lib/api';

/** Resolve a machine from the static catalog when CMS/API is down. */
export function getStaticProductBySlug(slug: string): Product | null {
  const p = products.find((item) => item.slug === slug);
  if (!p) return null;
  const category = categories.find((c) => c.id === p.categoryId || c.slug === p.categoryId);
  return {
    id: p.id,
    slug: p.slug,
    categoryId: p.categoryId,
    modelCode: p.modelCode,
    brochurePage: p.brochurePage,
    category: category
      ? {
          id: category.id,
          slug: category.slug,
          nameEn: category.nameEn,
          nameBn: category.nameBn,
          descriptionEn: category.descriptionEn,
          descriptionBn: category.descriptionBn,
        }
      : undefined,
    nameEn: p.nameEn,
    nameBn: p.nameBn,
    shortDescEn: p.shortDescEn,
    shortDescBn: p.shortDescBn,
    fullDescEn: p.fullDescEn,
    fullDescBn: p.fullDescBn,
    images: Array.isArray(p.images) ? p.images : [],
    specs: Array.isArray(p.specs) ? p.specs : [],
    packableIds: Array.isArray(p.packableIds) ? p.packableIds : [],
    videoUrl: p.videoUrl,
    featured: !!p.featured,
  };
}

export function isProductPayload(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return typeof p.slug === 'string' && typeof p.nameEn === 'string' && !('error' in p);
}
