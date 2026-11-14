import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePublicSite } from '@/lib/cmsApi';
import { requireAdmin } from '@/lib/requireAdmin';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(req: Request) {
  try {
    const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

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
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
