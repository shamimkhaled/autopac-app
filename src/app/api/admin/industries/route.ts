import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const industries = await req.json();
    for (const i of industries) {
      await prisma.industry.update({
        where: { id: i.id },
        data: { nameEn: i.nameEn, nameBn: i.nameBn },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
