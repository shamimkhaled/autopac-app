import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_STATS = [
  { id: 'default-0', labelEn: 'Machines Delivered', labelBn: 'মেশিন সরবরাহ', value: '500+', icon: 'zap',       sortOrder: 0 },
  { id: 'default-1', labelEn: 'Global Partners',    labelBn: 'গ্লোবাল পার্টনার', value: '25+', icon: 'award',   sortOrder: 1 },
  { id: 'default-2', labelEn: 'Happy Clients',      labelBn: 'সন্তুষ্ট ক্লায়েন্ট', value: '300+', icon: 'users', sortOrder: 2 },
  { id: 'default-3', labelEn: 'Years Experience',   labelBn: 'বছরের অভিজ্ঞতা', value: '15+',  icon: 'shield',   sortOrder: 3 },
];

export async function GET() {
  try {
    const stats = await prisma.siteStat.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    // If no stats in DB yet, seed defaults and return them
    if (stats.length === 0) {
      await prisma.siteStat.createMany({ data: DEFAULT_STATS });
      const seeded = await prisma.siteStat.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      return NextResponse.json(seeded);
    }

    return NextResponse.json(stats);
  } catch (e) {
    console.error(e);
    return NextResponse.json(DEFAULT_STATS);
  }
}
