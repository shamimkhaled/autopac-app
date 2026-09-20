import { NextResponse } from 'next/server';
import { getBrandTheme, getSeoMarketing } from '@/lib/siteAppearance';
import { cmsJson } from '@/lib/cmsApi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [theme, seo] = await Promise.all([getBrandTheme(), getSeoMarketing()]);
    return cmsJson({
      theme,
      seo: {
        googleAnalyticsId: seo.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID || '',
        facebookPixelId: seo.facebookPixelId || process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
