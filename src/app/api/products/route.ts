import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rows = await prisma.product.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    const products = rows.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      specs: JSON.parse(p.specs || '[]'),
      packableIds: JSON.parse(p.packableIds || '[]'),
    }));
    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
