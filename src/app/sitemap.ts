import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://autopacbd.com';

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE,               changeFrequency: 'daily',   priority: 1,   lastModified: new Date() },
  { url: `${BASE}/about`,    changeFrequency: 'monthly', priority: 0.8, lastModified: new Date() },
  { url: `${BASE}/products`, changeFrequency: 'daily',   priority: 0.9, lastModified: new Date() },
  { url: `${BASE}/gallery`,  changeFrequency: 'weekly',  priority: 0.8, lastModified: new Date() },
  { url: `${BASE}/news`,     changeFrequency: 'hourly',  priority: 0.7, lastModified: new Date() },
  { url: `${BASE}/contact`,  changeFrequency: 'monthly', priority: 0.8, lastModified: new Date() },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productUrls: MetadataRoute.Sitemap = [];
  let categoryUrls: MetadataRoute.Sitemap = [];

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    productUrls = products.map((p) => ({
      url: `${BASE}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Use clean paths for categories (better for SEO than query strings)
    categoryUrls = categories.map((c) => ({
      url: `${BASE}/products?category=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable during build — return static pages only
  }

  return [...STATIC_PAGES, ...productUrls, ...categoryUrls];
}
