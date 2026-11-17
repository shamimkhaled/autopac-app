import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const QUOTE_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'quotes');
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(`quote-upload:${ip}`, 10, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many uploads. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file selected' }, { status: 400 });
    }

    if (file.size <= 0 || file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File must be between 1 byte and 8 MB.' },
        { status: 400 }
      );
    }

    const isPdf = file.type === 'application/pdf';
    const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
    if (!isPdf && !isImage) {
      return NextResponse.json(
        { error: 'Unsupported format. Please upload JPG, PNG, WebP, or PDF.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await mkdir(QUOTE_UPLOAD_DIR, { recursive: true });

    const safeBase = path
      .parse(file.name.replace(/[^a-zA-Z0-9._-]/g, '_'))
      .name.slice(0, 48) || 'attachment';
    const id = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    if (isPdf) {
      // Verify %PDF- header signature
      if (buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
        return NextResponse.json({ error: 'Invalid PDF file.' }, { status: 400 });
      }
      const filename = `${id}-${safeBase}.pdf`;
      const targetPath = path.join(QUOTE_UPLOAD_DIR, filename);
      await writeFile(targetPath, buffer);

      return NextResponse.json({
        name: file.name,
        url: `/uploads/quotes/${filename}`,
        size: buffer.length,
        mimeType: 'application/pdf',
      });
    }

    // Re-encode image with sharp to strip EXIF metadata & guarantee safe output
    const filename = `${id}-${safeBase}.webp`;
    const targetPath = path.join(QUOTE_UPLOAD_DIR, filename);
    const info = await sharp(buffer)
      .resize(1800, 1800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(targetPath);

    return NextResponse.json({
      name: file.name,
      url: `/uploads/quotes/${filename}`,
      size: info.size,
      mimeType: 'image/webp',
    });
  } catch (e) {
    console.error('Quote attachment upload error:', e);
    return NextResponse.json({ error: 'Failed to process attachment.' }, { status: 500 });
  }
}
