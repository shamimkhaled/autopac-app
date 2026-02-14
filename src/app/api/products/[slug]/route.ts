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
    return NextResponse.json({
      ...p,
      images: JSON.parse(p.images || '[]'),
      specs: JSON.parse(p.specs || '[]'),
      packableIds: JSON.parse(p.packableIds || '[]'),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
