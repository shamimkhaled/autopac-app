import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePublicSite } from '@/lib/cmsApi';
import { requireAdmin } from '@/lib/requireAdmin';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

    const body = await req.json();
    await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        titleEn: body.titleEn,
        titleBn: body.titleBn,
        contentEn: body.contentEn || '',
        contentBn: body.contentBn || '',
        imageUrl: body.imageUrl || null,
        published: !!body.published,
      },
    });
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
    await prisma.blogPost.delete({ where: { slug: params.slug } });
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
