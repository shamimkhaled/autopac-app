import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const partners = await prisma.trustedPartner.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(partners);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
