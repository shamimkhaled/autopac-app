import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const slides = await req.json();
    
    // Get existing IDs from the incoming payload
    const existingIds = slides
      .filter((s: any) => s.id && !s.id.startsWith('new-'))
      .map((s: any) => s.id);

    // 1. Delete those not in the current payload
    await prisma.heroSlide.deleteMany({
      where: {
        id: { notIn: existingIds },
      },
    });

    // 2. Upsert (Create/Update) remaining slides
    for (const s of slides) {
      const slideData = {
        titleEn: s.titleEn,
        titleBn: s.titleBn,
        imageUrl: s.imageUrl,
        isActive: s.isActive,
        sortOrder: s.sortOrder || 0,
        linkUrl: s.linkUrl || null,
      };

      if (s.id && !s.id.startsWith('new-')) {
        await prisma.heroSlide.update({
          where: { id: s.id },
          data: slideData,
        });
      } else {
        await prisma.heroSlide.create({
          data: slideData,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
