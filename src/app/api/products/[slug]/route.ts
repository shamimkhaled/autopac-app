import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const p = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });
    if (!p) return NextResponse.json(null);
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
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
