import { NextResponse } from 'next/server';
import {
  getBrandTheme,
  getSeoMarketing,
  saveBrandTheme,
  saveSeoMarketing,
  type BrandTheme,
  type SeoMarketing,
} from '@/lib/siteAppearance';
import { requireAdmin } from '@/lib/requireAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const [theme, seo] = await Promise.all([getBrandTheme(), getSeoMarketing()]);
    return NextResponse.json({ theme, seo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const body = await req.json();
    if (body.theme) await saveBrandTheme(body.theme as BrandTheme);
    if (body.seo) await saveSeoMarketing(body.seo as SeoMarketing);
    const [theme, seo] = await Promise.all([getBrandTheme(), getSeoMarketing()]);
    const { revalidatePublicSite } = await import('@/lib/cmsApi');
    revalidatePublicSite();
    return NextResponse.json({ ok: true, theme, seo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
