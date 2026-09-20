import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getBrandTheme,
  getSeoMarketing,
  saveBrandTheme,
  saveSeoMarketing,
  type BrandTheme,
  type SeoMarketing,
} from '@/lib/siteAppearance';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [theme, seo] = await Promise.all([getBrandTheme(), getSeoMarketing()]);
    return NextResponse.json({ theme, seo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    if (body.theme) await saveBrandTheme(body.theme as BrandTheme);
    if (body.seo) await saveSeoMarketing(body.seo as SeoMarketing);
    const [theme, seo] = await Promise.all([getBrandTheme(), getSeoMarketing()]);
    return NextResponse.json({ ok: true, theme, seo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
