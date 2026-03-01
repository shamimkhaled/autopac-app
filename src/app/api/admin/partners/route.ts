import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const partners = await req.json();
    
    // Get existing IDs from incoming payload
    const existingIds = partners
      .filter((p: any) => p.id && !p.id.startsWith('new-'))
      .map((p: any) => p.id);

    // 1. Delete those not in the current payload
    await prisma.trustedPartner.deleteMany({
      where: {
        id: { notIn: existingIds },
      },
    });

    // 2. Upsert (Create/Update) remaining partners
    for (const p of partners) {
      const partnerData = {
        name: p.name,
        logoUrl: p.logoUrl,
        linkUrl: p.linkUrl || null,
        sortOrder: p.sortOrder || 0,
      };

      if (p.id && !p.id.startsWith('new-')) {
        await prisma.trustedPartner.update({
          where: { id: p.id },
          data: partnerData,
        });
      } else {
        await prisma.trustedPartner.create({
          data: partnerData,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
