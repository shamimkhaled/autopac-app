import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const partners = await req.json();
    for (const p of partners) {
      await prisma.trustedPartner.update({
        where: { id: p.id },
        data: { name: p.name, logoUrl: p.logoUrl, linkUrl: p.linkUrl || null },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
