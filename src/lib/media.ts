import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export const RESPONSIVE_SIZES = {
  desktop: 1920,
  laptop: 1440,
  tablet: 1024,
  mobile: 768,
  thumbnail: 480,
};

export async function processAndSaveImage(file: File, alt?: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const timestamp = Date.now();
  const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${timestamp}-${originalName}`;
  const baseName = path.parse(filename).name;
  const extension = '.webp'; // Standardize to webp for better compression

  await mkdir(UPLOAD_DIR, { recursive: true });

  // Save variants
  const variants: Record<string, string> = {};
  
  // Also save the original (optimized)
  const originalPath = path.join(UPLOAD_DIR, `${baseName}${extension}`);
  const originalInfo = await sharp(buffer)
    .webp({ quality: 85 })
    .toFile(originalPath);

  variants['original'] = `/uploads/${baseName}${extension}`;

  // Process responsive variants
  for (const [sizeName, width] of Object.entries(RESPONSIVE_SIZES)) {
    const variantPath = path.join(UPLOAD_DIR, `${baseName}-${sizeName}${extension}`);
    await sharp(buffer)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(variantPath);
    
    variants[sizeName] = `/uploads/${baseName}-${sizeName}${extension}`;
  }

  // Save to DB
  const media = await prisma.media.create({
    data: {
      url: variants['original'],
      alt: alt || originalName,
      type: 'image',
      size: originalInfo.size,
      mimeType: 'image/webp',
      width: originalInfo.width,
      height: originalInfo.height,
    },
  });

  return media;
}
