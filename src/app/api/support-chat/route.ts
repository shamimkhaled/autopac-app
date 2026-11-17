import { NextResponse } from 'next/server';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { products as staticProducts } from '@/data/products';
import { BROCHURE_LINES } from '@/data/brochure';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        text: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
  language: z.enum(['auto', 'en', 'bn']).optional().default('auto'),
});

async function buildKnowledgeContext(): Promise<string> {
  let companyText =
    'Auto Pac Machinery (Est. 1990) | Address: 128/3 Kawran Bazar, Dhaka 1215, Bangladesh | Phone: 01631769707, 01818496642 | WhatsApp: +8801818496642 | Email: autopacbd@gmail.com | Hours: Sat-Thu 9:30 AM - 6:30 PM (BST)';

  try {
    const company = await prisma.companyProfile.findFirst();
    if (company) {
      companyText = `Auto Pac Machinery (Est. 1990) | Address: ${company.address || '128/3 Kawran Bazar, Dhaka 1215, Bangladesh'} | Phone: ${company.phone || '01631769707, 01818496642'} | WhatsApp: +${company.whatsapp || '8801818496642'} | Email: ${company.email || 'autopacbd@gmail.com'} | Hours: ${company.officeHours || 'Sat-Thu 9:30 AM - 6:30 PM (BST)'}`;
    }
  } catch {
    /* fallback to default company profile */
  }

  const linesSummary = BROCHURE_LINES.map(
    (l) =>
      `- Line ${l.number} (${l.shortEn} / ${l.shortBn}): ${l.titleEn}. Catalog page: /brochure?line=${l.id}&page=${l.startPage}. Packs: ${l.packables.join(', ')}`
  ).join('\n');

  let productSummary = '';
  try {
    const dbProducts = await prisma.product.findMany({
      take: 40,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
      select: { slug: true, nameEn: true, nameBn: true, shortDescEn: true, specs: true },
    });
    const list =
      dbProducts.length > 0
        ? dbProducts.map((p) => {
            let specsStr = '';
            try {
              const parsed = JSON.parse(p.specs || '[]') as { keyEn: string; value: string; unit?: string }[];
              specsStr = parsed
                .slice(0, 4)
                .map((s) => `${s.keyEn}: ${s.value}${s.unit ? ' ' + s.unit : ''}`)
                .join('; ');
            } catch {
              specsStr = '';
            }
            return `- ${p.nameEn} (${p.nameBn}): ${p.shortDescEn}${specsStr ? ` [${specsStr}]` : ''} | Quote: /contact?product=${encodeURIComponent(p.nameEn)} | Catalog: /products/${p.slug}`;
          })
        : staticProducts.slice(0, 35).map((p) => {
            const specsStr = (p.specs || [])
              .slice(0, 4)
              .map((s) => `${s.keyEn}: ${s.value}${s.unit ? ' ' + s.unit : ''}`)
              .join('; ');
            return `- ${p.nameEn} (${p.nameBn}): ${p.shortDescEn}${specsStr ? ` [${specsStr}]` : ''} | Quote: /contact?product=${encodeURIComponent(p.nameEn)} | Details: /products/${p.slug}`;
          });
    productSummary = list.join('\n');
  } catch {
    productSummary = staticProducts
      .slice(0, 30)
      .map((p) => `- ${p.nameEn}: ${p.shortDescEn}`)
      .join('\n');
  }

  return `COMPANY INFO:\n${companyText}\n\n16 OFFICIAL BROCHURE PRODUCT LINES:\n${linesSummary}\n\nMACHINERY CATALOG:\n${productSummary}`;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(`support-chat:${ip}`, 20, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'Customer support AI is not configured yet (missing GEMINI_API_KEY). Please reach our engineers directly via WhatsApp or the Quotation form.',
      },
      { status: 503 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = chatRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid chat request payload.' },
        { status: 400 }
      );
    }

    const { messages, language } = parsed.data;
    const context = await buildKnowledgeContext();

    const langDirective =
      language === 'bn'
        ? 'Respond primarily in natural, clear Bengali (বাংলা), using English technical model names where standard in Bangladesh factories.'
        : language === 'en'
          ? 'Respond in clear, professional English.'
          : 'Automatically detect the user’s language (English, Bengali / বাংলা, Banglish, Hindi, Urdu, Arabic, etc.) and respond fluently in that same language.';

    const systemInstruction = `You are the senior customer support engineer & machinery advisor for **Auto Pac Machinery** (est. 1990, 128/3 Kawran Bazar, Dhaka, Bangladesh).

RULES & TONE:
1. ${langDirective}
2. Be concise, practical, trustworthy, and tailored to factory owners, SMEs, and procurement engineers in Bangladesh and export buyers. Keep replies scannable with short bullet points (under 180 words unless detailed comparison is requested).
3. Ground every machine recommendation ONLY in the catalog below. Include helpful clickable internal Markdown links so users can explore or request a quote immediately, e.g.:
   - [Machine Details](/products/slug)
   - [Catalog Page](/brochure?line=...&page=...)
   - [Request Quotation](/contact?product=Machine%20Name)
4. Pricing in BDT/USD depends on required output capacity, hopper/frame material (SS-304 / SS-316), PLC automation level, and local power specs (220V single-phase or 380V 3-phase 50Hz in Bangladesh). NEVER invent exact machine prices if not explicitly listed. Instead guide them to request an official pro-forma quotation at [Request Quotation](/contact) or via WhatsApp (+8801818496642).
5. Always mention Auto Pac's full service support: factory installation, operator training, calibration, and local spare parts stock in Dhaka.

${context}`;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const latestMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-4-hydrogen',
      history,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const response = await chat.sendMessage({ message: latestMessage.text });
    const reply = response.text?.trim();

    if (!reply) {
      return NextResponse.json(
        { error: 'Empty response from support agent. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error('Support chat API error:', err);
    const rawMsg = err instanceof Error ? err.message : 'Support service error';

    if (
      rawMsg.includes('API_KEY_INVALID') ||
      rawMsg.includes('PERMISSION_DENIED') ||
      rawMsg.includes('API key not valid')
    ) {
      return NextResponse.json(
        {
          error:
            'The Gemini API key in Settings > Secrets appears invalid or unauthorized. Please check the API key, or reach our engineers directly via WhatsApp or the Quotation form.',
        },
        { status: 503 }
      );
    }

    if (rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429')) {
      return NextResponse.json(
        {
          error:
            'Support assistant rate limit reached. Please try again shortly or message us directly on WhatsApp.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          'Unable to reach the support assistant right now. Please use WhatsApp or the Quotation form.',
      },
      { status: 500 }
    );
  }
}
