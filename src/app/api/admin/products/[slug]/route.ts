import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json();
    const { nameEn, nameBn, shortDescEn, shortDescBn, fullDescEn, fullDescBn, images, specs, packableIds, videoUrl, featured } = body;
    await prisma.product.update({
      where: { slug: params.slug },
      data: {
        nameEn,
        nameBn,
        shortDescEn,
        shortDescBn,
        fullDescEn,
        fullDescBn,
        images: JSON.stringify(images || []),
        specs: JSON.stringify(specs || []),
        packableIds: JSON.stringify(packableIds || []),
        videoUrl: videoUrl || null,
        featured: !!featured,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
