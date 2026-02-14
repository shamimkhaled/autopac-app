import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const existing = await prisma.companyProfile.findFirst();
    if (existing) {
      await prisma.companyProfile.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      await prisma.companyProfile.create({ data: body });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
