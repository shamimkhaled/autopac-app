import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rows = await prisma.product.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    const products = rows.map((p) => {
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

      return {
        ...p,
        images,
        specs,
        packableIds,
      };
    });
    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
