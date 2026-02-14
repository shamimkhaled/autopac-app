import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const owner = await prisma.ownerProfile.findFirst({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(owner);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
