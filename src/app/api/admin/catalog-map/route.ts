import { NextResponse } from 'next/server';
import { type ProductBrochureMap } from '@/data/brochure';
import { getCatalogMap, saveCatalogMap } from '@/lib/catalogMap';
import { revalidatePublicSite } from '@/lib/cmsApi';
import { requireAdmin } from '@/lib/requireAdmin';
import { catalogMapWriteSchema, zodErrorResponse } from '@/lib/cmsSchemas';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const map = await getCatalogMap();
  return NextResponse.json(map);
}

export async function PUT(req: Request) {
  try {
    const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

    const body = await req.json();
    const parsed = catalogMapWriteSchema.safeParse(body);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error) ?? NextResponse.json({ error: 'Invalid map' }, { status: 400 });
    }

    const cleaned: ProductBrochureMap = {};
    for (const [slug, meta] of Object.entries(parsed.data)) {
      if (!slug || !meta?.lineId || !Number.isFinite(Number(meta.page))) continue;
      cleaned[slug] = { lineId: String(meta.lineId), page: Math.max(1, Math.round(Number(meta.page))) };
    }

    await saveCatalogMap(cleaned);
    revalidatePublicSite();
    return NextResponse.json({ ok: true, map: cleaned });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
