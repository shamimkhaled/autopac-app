import { NextResponse } from 'next/server';
import { getBrandTheme, getSeoMarketing, getPwaConfig } from '@/lib/siteAppearance';
import { cmsJson } from '@/lib/cmsApi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [theme, seo, pwa] = await Promise.all([
      getBrandTheme(),
      getSeoMarketing(),
      getPwaConfig(),
    ]);
    return cmsJson({
      theme,
      pwa: {
        appName: pwa.appName,
        shortName: pwa.shortName,
        themeColor: pwa.themeColor,
        showInstallButton: pwa.showInstallButton,
        showMobileStickyBar: pwa.showMobileStickyBar,
        showWhatsAppButton: pwa.showWhatsAppButton,
        showSupportChat: pwa.showSupportChat,
      },
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
