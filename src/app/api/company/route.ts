import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cmsJson } from '@/lib/cmsApi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const company = await prisma.companyProfile.findFirst();
    return cmsJson(company);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
