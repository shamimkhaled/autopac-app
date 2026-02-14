import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const existing = await prisma.ownerProfile.findFirst();
    if (existing) {
      await prisma.ownerProfile.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      await prisma.ownerProfile.create({ data: body });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
