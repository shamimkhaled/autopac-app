import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePublicSite } from '@/lib/cmsApi';
import { requireAdmin } from '@/lib/requireAdmin';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
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
    const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

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

    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
