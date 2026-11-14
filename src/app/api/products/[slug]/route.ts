import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStaticProductBySlug } from '@/lib/staticProduct';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const p = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });
    if (!p) {
      const fallback = getStaticProductBySlug(params.slug);
      return fallback
        ? NextResponse.json(fallback)
        : NextResponse.json(null, { status: 404 });
    }
    let images = [];
    let specs = [];
    let packableIds = [];

    try {
      images = JSON.parse(p.images || '[]');
    } catch (e) {
      console.error(`Error parsing images for product ${p.id}:`, e);
    }

    try {
      specs = JSON.parse(p.specs || '[]');
    } catch (e) {
      console.error(`Error parsing specs for product ${p.id}:`, e);
    }

    try {
      packableIds = JSON.parse(p.packableIds || '[]');
    } catch (e) {
      console.error(`Error parsing packableIds for product ${p.id}:`, e);
    }

    return NextResponse.json({
      ...p,
      images,
      specs,
      packableIds,
    });
  } catch (e) {
    console.error(e);
    const fallback = getStaticProductBySlug(params.slug);
    if (fallback) return NextResponse.json(fallback);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
