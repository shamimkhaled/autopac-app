import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const slides = await prisma.heroSlide.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(slides);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slides = await req.json();
    
    interface SlidePayload {
      id?: string;
      titleEn: string;
      titleBn: string;
      imageUrl: string;
      isActive: boolean;
      sortOrder?: number;
      linkUrl?: string;
    }

    // Get existing IDs from the incoming payload
    const existingIds = (slides as SlidePayload[])
      .filter((s) => s.id && !s.id.startsWith('new-'))
      .map((s) => s.id as string);

    // 1. Delete those not in the current payload
    await prisma.heroSlide.deleteMany({
      where: {
        id: { notIn: existingIds },
      },
    });

    // 2. Upsert (Create/Update) remaining slides
    for (const s of slides as SlidePayload[]) {
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
