import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePublicSite } from '@/lib/cmsApi';
import { requireAdmin } from '@/lib/requireAdmin';
import { categoriesWriteSchema, zodErrorResponse } from '@/lib/cmsSchemas';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(req: Request) {
  try {
    const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

    const raw = await req.json();
    const parsed = categoriesWriteSchema.safeParse(raw);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error) ?? NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const named = parsed.data.filter((c) => c.nameEn?.trim());
    if (named.length === 0) {
      return NextResponse.json({ error: 'Keep at least one category' }, { status: 400 });
    }

    const existingIds = named
      .filter((c) => c.id && !String(c.id).startsWith('new-'))
      .map((c) => c.id as string);

    await prisma.category.deleteMany({
      where: {
        id: { notIn: existingIds.length ? existingIds : ['__keep__'] },
        products: { none: {} },
      },
    });

    for (let index = 0; index < named.length; index++) {
      const c = named[index];
      if (!c.nameEn?.trim()) continue;
      const data = {
        slug: c.slug || c.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        nameEn: c.nameEn,
        nameBn: c.nameBn || c.nameEn,
        descriptionEn: c.descriptionEn || null,
        descriptionBn: c.descriptionBn || null,
        imageUrl: c.imageUrl || null,
        sortOrder: c.sortOrder ?? index,
      };

      if (c.id && !String(c.id).startsWith('new-')) {
        await prisma.category.update({ where: { id: c.id }, data });
      } else {
        await prisma.category.create({ data });
      }
    }

    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
