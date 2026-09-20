import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(industries);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
