import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { setProductCatalogLink } from '@/lib/catalogMap';

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { categoryId, nameEn, nameBn, shortDescEn, shortDescBn, fullDescEn, fullDescBn, images, specs, packableIds, videoUrl, featured, brochureLineId, brochurePage } = body;
    await prisma.product.update({
      where: { slug: params.slug },
      data: {
        categoryId,
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
    if (brochureLineId !== undefined) {
      await setProductCatalogLink(params.slug, brochureLineId, brochurePage);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.product.delete({
      where: { slug: params.slug },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
