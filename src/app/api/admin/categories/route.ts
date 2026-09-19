import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface CategoryPayload {
  id?: string;
  slug?: string;
  nameEn: string;
  nameBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const categories = (await req.json()) as CategoryPayload[];
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const named = categories.filter((c) => c.nameEn?.trim());
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

    for (const [index, c] of named.entries()) {
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

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
