import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// A visitor is "active" if their last ping is within 3 minutes
const ACTIVE_WINDOW_MS = 3 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { visitorId, page } = await req.json();
    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const now = new Date();
    await prisma.activeVisitor.upsert({
      where: { visitorId },
      update: { lastPing: now, page: page ?? null },
      create: { visitorId, page: page ?? null, lastPing: now },
    });

    // Prune stale sessions older than 10 minutes
    await prisma.activeVisitor.deleteMany({
      where: { lastPing: { lt: new Date(Date.now() - 10 * 60 * 1000) } },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    // Silently degrade — table may not exist yet (run `npx prisma db push`)
    if (process.env.NODE_ENV === 'development') {
      console.warn('[tracker] DB unavailable — run `npx prisma db push`:', (e as Error).message);
    }
    return NextResponse.json({ ok: false });
  }
}

export async function GET() {
  try {
    const since = new Date(Date.now() - ACTIVE_WINDOW_MS);
    const count = await prisma.activeVisitor.count({
      where: { lastPing: { gte: since } },
    });
    const pages = await prisma.activeVisitor.groupBy({
      by: ['page'],
      where: { lastPing: { gte: since }, page: { not: null } },
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 5,
    });
    return NextResponse.json({ activeVisitors: count, topPages: pages });
  } catch (e) {
    console.error('[tracker GET]', e);
    return NextResponse.json({ activeVisitors: 0, topPages: [] });
  }
}
