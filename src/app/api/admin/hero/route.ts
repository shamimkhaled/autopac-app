import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const slides = await req.json();
    for (const s of slides) {
      await prisma.heroSlide.update({
        where: { id: s.id },
        data: { titleEn: s.titleEn, titleBn: s.titleBn, imageUrl: s.imageUrl, isActive: s.isActive },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
