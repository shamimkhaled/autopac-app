import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categoryId, nameEn, nameBn, shortDescEn, shortDescBn, fullDescEn, fullDescBn, images, specs, packableIds, videoUrl, featured } = body;
    const slug = body.slug || nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const product = await prisma.product.create({
      data: {
        slug,
        categoryId,
        nameEn,
        nameBn,
        shortDescEn: shortDescEn || '',
        shortDescBn: shortDescBn || '',
        fullDescEn: fullDescEn || '',
        fullDescBn: fullDescBn || '',
        images: JSON.stringify(images || []),
        specs: JSON.stringify(specs || []),
        packableIds: JSON.stringify(packableIds || []),
        videoUrl: videoUrl || null,
        featured: !!featured,
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
