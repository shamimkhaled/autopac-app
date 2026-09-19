import { NextResponse } from 'next/server';
import { getCatalogMap } from '@/lib/catalogMap';

export async function GET() {
  const map = await getCatalogMap();
  return NextResponse.json(map);
}
