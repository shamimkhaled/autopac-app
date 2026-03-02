import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partners = await req.json();
    
    interface PartnerPayload {
      id?: string;
      name: string;
      logoUrl: string;
      linkUrl?: string;
      sortOrder?: number;
    }

    // Get existing IDs from incoming payload
    const existingIds = (partners as PartnerPayload[])
      .filter((p) => p.id && !p.id.startsWith('new-'))
      .map((p) => p.id as string);

    // 1. Delete those not in the current payload
    await prisma.trustedPartner.deleteMany({
      where: {
        id: { notIn: existingIds },
      },
    });

    // 2. Upsert (Create/Update) remaining partners
    for (const p of partners as PartnerPayload[]) {
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
