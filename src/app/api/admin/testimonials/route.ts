import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testimonials = await req.json();

    interface TestimonialPayload {
      id?: string;
      nameEn: string;
      nameBn: string;
      company?: string;
      designation?: string;
      messageEn: string;
      messageBn: string;
      rating?: number;
      imageUrl?: string;
      isActive?: boolean;
    }

    const existingIds = (testimonials as TestimonialPayload[])
      .filter((t) => t.id && !t.id.startsWith('new-'))
      .map((t) => t.id as string);

    await prisma.testimonial.deleteMany({
      where: { id: { notIn: existingIds } },
    });

    for (const t of testimonials as TestimonialPayload[]) {
      const data = {
        nameEn: t.nameEn || '',
        nameBn: t.nameBn || '',
        company: t.company || null,
        designation: t.designation || null,
        messageEn: t.messageEn || '',
        messageBn: t.messageBn || '',
        rating: Math.min(5, Math.max(1, Number(t.rating) || 5)),
        imageUrl: t.imageUrl || null,
        isActive: t.isActive !== false,
      };

      if (t.id && !t.id.startsWith('new-')) {
        await prisma.testimonial.update({ where: { id: t.id }, data });
      } else {
        await prisma.testimonial.create({ data });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
