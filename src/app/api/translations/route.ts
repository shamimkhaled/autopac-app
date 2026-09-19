import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rows = await prisma.translation.findMany();
    const map: Record<string, { en: string; bn: string }> = {};
    for (const row of rows) {
      map[row.key] = { en: row.valueEn, bn: row.valueBn };
    }
    return NextResponse.json(map);
  } catch (e) {
    console.error(e);
    return NextResponse.json({});
  }
}
