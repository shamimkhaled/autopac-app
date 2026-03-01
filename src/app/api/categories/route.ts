import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (e: any) {
    console.error('Categories API Error:', e);
    return NextResponse.json({ 
      error: 'Failed to fetch categories',
      message: e.message || 'Unknown error',
      code: e.code
    }, { status: 500 });
  }
}
