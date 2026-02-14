import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'autopac2025';

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password === ADMIN_PASS) {
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
    return NextResponse.json({ ok: true, token });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
