import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSeoMarketing } from '@/lib/siteAppearance';

const ACTIVE_WINDOW_MS = 3 * 60 * 1000;


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const since = new Date(Date.now() - ACTIVE_WINDOW_MS);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      products,
      partners,
      testimonials,
      quotesTotal,
      quotesPending,
      quotesWeek,
      quotesMonth,
      activeVisitors,
      topPages,
      recentQuotes,
      seo,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.trustedPartner.count(),
      prisma.testimonial.count({ where: { isActive: true } }),
      prisma.quotationRequest.count(),
      prisma.quotationRequest.count({ where: { status: 'PENDING' } }),
      prisma.quotationRequest.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.quotationRequest.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.activeVisitor.count({ where: { lastPing: { gte: since } } }),
      prisma.activeVisitor.groupBy({
        by: ['page'],
        where: { lastPing: { gte: since }, page: { not: null } },
        _count: { page: true },
        orderBy: { _count: { page: 'desc' } },
        take: 8,
      }),
      prisma.quotationRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          name: true,
          productInterest: true,
          status: true,
          createdAt: true,
        },
      }),
      getSeoMarketing(),
    ]);

    return NextResponse.json({
      business: {
        products,
        partners,
        testimonials,
        quotesTotal,
        quotesPending,
        quotesWeek,
        quotesMonth,
      },
      traffic: {
        activeVisitors,
        topPages,
      },
      recentQuotes,
      marketing: {
        googleAnalyticsId: seo.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID || '',
        facebookPixelId: seo.facebookPixelId || process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
        googleSiteVerification:
          seo.googleSiteVerification || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
