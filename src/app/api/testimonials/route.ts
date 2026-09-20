import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const items = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}
