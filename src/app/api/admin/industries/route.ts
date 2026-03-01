import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const industries = await req.json();
    
    // Get existing IDs from incoming payload
    const existingIds = industries
      .filter((i: any) => i.id && !i.id.startsWith('new-'))
      .map((i: any) => i.id);

    // 1. Delete those not in current payload
    await prisma.industry.deleteMany({
      where: {
        id: { notIn: existingIds },
      },
    });

    // 2. Upsert (Create/Update) remaining industries
    for (const i of industries) {
      const data = {
        slug: i.slug || i.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        nameEn: i.nameEn,
        nameBn: i.nameBn,
        descriptionEn: i.descriptionEn || null,
        descriptionBn: i.descriptionBn || null,
        sortOrder: i.sortOrder || 0,
        iconUrl: i.iconUrl || null,
      };

      if (i.id && !i.id.startsWith('new-')) {
        await prisma.industry.update({
          where: { id: i.id },
          data,
        });
      } else {
        await prisma.industry.create({
          data,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
