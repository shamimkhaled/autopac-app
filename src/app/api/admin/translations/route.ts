import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const rows = await prisma.translation.findMany({ orderBy: { key: 'asc' } });
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rows = (await req.json()) as Array<{
      id?: string;
      key: string;
      valueEn: string;
      valueBn: string;
    }>;
    if (!Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const keepIds = rows.filter((r) => r.id && !String(r.id).startsWith('new-')).map((r) => r.id as string);
    await prisma.translation.deleteMany({
      where: keepIds.length ? { id: { notIn: keepIds } } : undefined,
    });

    for (const row of rows) {
      if (!row.key?.trim()) continue;
      const data = {
        key: row.key.trim(),
        valueEn: row.valueEn || '',
        valueBn: row.valueBn || '',
      };
      if (row.id && !String(row.id).startsWith('new-')) {
        await prisma.translation.update({ where: { id: row.id }, data });
      } else {
        await prisma.translation.upsert({
          where: { key: data.key },
          update: { valueEn: data.valueEn, valueBn: data.valueBn },
          create: data,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
