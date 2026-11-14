import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(posts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

    const body = await req.json();
    const titleEn = String(body.titleEn || '').trim();
    if (!titleEn) return NextResponse.json({ error: 'Title required' }, { status: 400 });

    const post = await prisma.blogPost.create({
      data: {
        slug: body.slug ? slugify(body.slug) : slugify(titleEn),
        titleEn,
        titleBn: body.titleBn || titleEn,
        contentEn: body.contentEn || '',
        contentBn: body.contentBn || '',
        imageUrl: body.imageUrl || null,
        published: body.published !== false,
        authorId: auth.session.user?.id || null,
      },
    });
    const { revalidatePublicSite } = await import('@/lib/cmsApi');
    revalidatePublicSite();
    return NextResponse.json(post);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
