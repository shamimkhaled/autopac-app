import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setProductCatalogLink } from '@/lib/catalogMap';
import { requireAdmin } from '@/lib/requireAdmin';
import { productWriteSchema, zodErrorResponse } from '@/lib/cmsSchemas';
import { revalidatePublicSite } from '@/lib/cmsApi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

    const body = await req.json();
    const parsed = productWriteSchema.safeParse(body);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error) ?? NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const data = parsed.data;
    const slug =
      data.slug ||
      data.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const product = await prisma.product.create({
      data: {
        slug,
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
      await setProductCatalogLink(slug, data.brochureLineId, data.brochurePage);
    }
    revalidatePublicSite();
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
