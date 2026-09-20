import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { type ProductBrochureMap } from '@/data/brochure';
import { getCatalogMap, saveCatalogMap } from '@/lib/catalogMap';
import { revalidatePublicSite } from '@/lib/cmsApi';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const map = await getCatalogMap();
  return NextResponse.json(map);
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = (await req.json()) as ProductBrochureMap;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid map' }, { status: 400 });
    }

    const cleaned: ProductBrochureMap = {};
    for (const [slug, meta] of Object.entries(body)) {
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
