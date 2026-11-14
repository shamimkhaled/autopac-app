import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setProductCatalogLink } from '@/lib/catalogMap';
import { revalidatePublicSite } from '@/lib/cmsApi';
import { requireAdmin, ADMIN_WRITE_ROLES } from '@/lib/requireAdmin';
import { productWriteSchema, zodErrorResponse } from '@/lib/cmsSchemas';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

    const body = await req.json();
    const parsed = productWriteSchema.safeParse(body);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error) ?? NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const data = parsed.data;
    await prisma.product.update({
      where: { slug: params.slug },
      data: {
        categoryId: data.categoryId,
        nameEn: data.nameEn,
        nameBn: data.nameBn,
        shortDescEn: data.shortDescEn,
        shortDescBn: data.shortDescBn,
        fullDescEn: data.fullDescEn,
        fullDescBn: data.fullDescBn,
        images: JSON.stringify(data.images),
        specs: JSON.stringify(data.specs),
        packableIds: JSON.stringify(data.packableIds),
        videoUrl: data.videoUrl || null,
        featured: !!data.featured,
      },
    });
    if (data.brochureLineId !== undefined) {
      await setProductCatalogLink(params.slug, data.brochureLineId, data.brochurePage);
    }
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const auth = await requireAdmin(ADMIN_WRITE_ROLES);
    if (!auth.ok) return auth.response;

    await prisma.product.delete({
      where: { slug: params.slug },
    });
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
