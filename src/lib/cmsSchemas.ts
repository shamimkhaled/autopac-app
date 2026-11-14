import { z, ZodError } from 'zod';
import { NextResponse } from 'next/server';

export const productSpecSchema = z.object({
  keyEn: z.string().min(1),
  keyBn: z.string().optional().default(''),
  value: z.string().min(1),
  unit: z.string().optional(),
});

export const productWriteSchema = z.object({
  categoryId: z.string().min(1),
  nameEn: z.string().min(1),
  nameBn: z.string().optional().default(''),
  shortDescEn: z.string().optional().default(''),
  shortDescBn: z.string().optional().default(''),
  fullDescEn: z.string().optional().default(''),
  fullDescBn: z.string().optional().default(''),
  images: z.array(z.string()).optional().default([]),
  specs: z.array(productSpecSchema).optional().default([]),
  packableIds: z.array(z.string()).optional().default([]),
  videoUrl: z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) => (v && String(v).trim() ? String(v).trim() : null)),
  featured: z.coerce.boolean().optional().default(false),
  slug: z.string().optional(),
  brochureLineId: z.string().nullable().optional(),
  brochurePage: z.coerce.number().int().positive().nullable().optional(),
});

export const categoryPayloadSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  nameEn: z.string().min(1),
  nameBn: z.string().optional().default(''),
  descriptionEn: z.string().optional(),
  descriptionBn: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const categoriesWriteSchema = z.array(categoryPayloadSchema).min(1);

export const quoteStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'RESPONDED', 'CLOSED']),
});

export const catalogMapEntrySchema = z.object({
  lineId: z.string().min(1),
  page: z.number().int().positive(),
});

export const catalogMapWriteSchema = z.record(z.string(), catalogMapEntrySchema);

export const websiteContentWriteSchema = z
  .object({
    hero: z.object({}).passthrough(),
    find: z.object({}).passthrough(),
    lines: z.object({}).passthrough(),
    featured: z.object({}).passthrough(),
    story: z.object({}).passthrough(),
    catalogBand: z.object({}).passthrough(),
    footer: z.object({}).passthrough(),
  })
  .passthrough();

export function zodErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Invalid payload', issues: error.issues }, { status: 400 });
  }
  return null;
}

/** Escape user-controlled strings before interpolating into HTML email bodies. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
