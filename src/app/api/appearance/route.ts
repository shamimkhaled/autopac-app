import { NextResponse } from 'next/server';
import { getBrandTheme, getSeoMarketing } from '@/lib/siteAppearance';

export async function GET() {
  try {
    const [theme, seo] = await Promise.all([getBrandTheme(), getSeoMarketing()]);
    return NextResponse.json({
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
