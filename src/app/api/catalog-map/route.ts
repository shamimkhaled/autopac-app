import { NextResponse } from 'next/server';
import { getCatalogMap } from '@/lib/catalogMap';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const map = await getCatalogMap();
  return NextResponse.json(map);
}
