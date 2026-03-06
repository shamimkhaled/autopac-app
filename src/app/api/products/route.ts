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
      } catch {
        console.warn(`[products] Malformed images JSON for product ${p.id} — using empty array`);
      }

      try {
        specs = JSON.parse(p.specs || '[]');
      } catch {
        console.warn(`[products] Malformed specs JSON for product ${p.id} — using empty array`);
      }

      try {
        packableIds = JSON.parse(p.packableIds || '[]');
      } catch {
        console.warn(`[products] Malformed packableIds JSON for product ${p.id} — using empty array`);
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
