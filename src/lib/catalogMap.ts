import { prisma } from '@/lib/prisma';
import { PRODUCT_BROCHURE, type ProductBrochureMap } from '@/data/brochure';

export const CATALOG_MAP_KEY = 'productBrochure';

export async function getCatalogMap(): Promise<ProductBrochureMap> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: CATALOG_MAP_KEY } });
    if (!row?.value) return { ...PRODUCT_BROCHURE };
    const parsed = JSON.parse(row.value) as ProductBrochureMap;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ...PRODUCT_BROCHURE };
    }
    return parsed;
  } catch {
    return { ...PRODUCT_BROCHURE };
  }
}

export async function saveCatalogMap(map: ProductBrochureMap) {
  const value = JSON.stringify(map);
  await prisma.siteSetting.upsert({
    where: { key: CATALOG_MAP_KEY },
    update: { value, description: 'CMS product slug → brochure line and page' },
    create: {
      key: CATALOG_MAP_KEY,
      value,
      description: 'CMS product slug → brochure line and page',
    },
  });
}

export async function setProductCatalogLink(
  slug: string,
  lineId?: string | null,
  page?: number | null
) {
  const map = await getCatalogMap();
  if (!lineId) {
    delete map[slug];
  } else {
    map[slug] = {
      lineId,
      page: Math.max(1, Math.round(Number(page) || 1)),
    };
  }
  await saveCatalogMap(map);
}
