import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const stats = await prisma.siteStat.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(stats);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const stat = await prisma.siteStat.create({
    data: {
      labelEn: body.labelEn,
      labelBn: body.labelBn,
      value: body.value,
      icon: body.icon || 'award',
      sortOrder: body.sortOrder ?? 0,
      isActive: body.isActive ?? true,
    },
  });
  return NextResponse.json(stat);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const stats: Array<{ id: string; labelEn: string; labelBn: string; value: string; icon?: string; sortOrder?: number; isActive?: boolean }> = await req.json();

  await Promise.all(
    stats.map((s) =>
      prisma.siteStat.upsert({
        where: { id: s.id },
        update: {
          labelEn: s.labelEn,
          labelBn: s.labelBn,
          value: s.value,
          icon: s.icon,
          sortOrder: s.sortOrder,
          isActive: s.isActive,
        },
        create: {
          id: s.id,
          labelEn: s.labelEn,
          labelBn: s.labelBn,
          value: s.value,
          icon: s.icon ?? 'award',
          sortOrder: s.sortOrder ?? 0,
          isActive: s.isActive ?? true,
        },
      })
    )
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await prisma.siteStat.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
