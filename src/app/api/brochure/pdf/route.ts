import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-static';

export async function GET() {
  const filePath = path.join(process.cwd(), 'brochure-content', 'Auto Pac web see.pdf');
  try {
    const data = await readFile(filePath);
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(data.byteLength),
        'Content-Disposition': 'inline; filename="Auto-Pac-machinery-catalog.pdf"',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Catalog PDF not found' }, { status: 404 });
  }
}
