import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z, ZodError } from 'zod';
import nodemailer from 'nodemailer';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { escapeHtml } from '@/lib/cmsSchemas';
import { requireAdmin } from '@/lib/requireAdmin';

const attachmentSchema = z.object({
  name: z.string().min(1).max(200),
  url: z
    .string()
    .min(1)
    .max(500)
    .refine((u) => u.startsWith('/uploads/quotes/'), 'Invalid attachment path'),
  size: z.number().nonnegative().optional(),
  mimeType: z.string().max(100).optional(),
});

const quoteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  companyName: z.string().optional(),
  factoryLocation: z.string().max(140).optional(),
  scale: z.string().max(80).optional(),
  capacityTarget: z.string().max(120).optional(),
  productInterest: z.string().min(2, 'Product interest is required'),
  message: z.string().min(10, 'Message is too short'),
  attachments: z.array(attachmentSchema).max(3).optional().default([]),
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525', 10),
  auth: {
    user: process.env.SMTP_USER || 'test_user',
    pass: process.env.SMTP_PASS || 'test_pass',
  },
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(`quote:${ip}`, 4, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait before submitting again.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
    );
  }

  try {
    const body = await req.json();

    if (body._hp) {
      return NextResponse.json({ success: true });
    }

    const data = quoteSchema.parse(body);

    const contextLines: string[] = [];
    if (data.factoryLocation?.trim()) contextLines.push(`Location: ${data.factoryLocation.trim()}`);
    if (data.scale?.trim()) contextLines.push(`Factory Scale: ${data.scale.trim()}`);
    if (data.capacityTarget?.trim()) contextLines.push(`Target Output: ${data.capacityTarget.trim()}`);

    const fullMessage = contextLines.length
      ? `${contextLines.join(' | ')}\n\n${data.message.trim()}`
      : data.message.trim();

    const attachmentsJson =
      data.attachments && data.attachments.length > 0
        ? JSON.stringify(data.attachments)
        : null;

    let quote;
    try {
      quote = await prisma.quotationRequest.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          companyName: data.companyName,
          productInterest: data.productInterest,
          message: fullMessage,
          attachments: attachmentsJson,
        },
      });
    } catch (dbErr) {
      // Fallback if connected database has not yet applied `attachments` column migration
      const msg = dbErr instanceof Error ? dbErr.message : '';
      if (msg.includes('Unknown column') || msg.includes('attachments') || msg.includes('P2022')) {
        const attachmentNotes = data.attachments.length
          ? `\n\n[Attachments]\n${data.attachments.map((a) => `- ${a.name}: ${a.url}`).join('\n')}`
          : '';
        quote = await prisma.quotationRequest.create({
          data: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            companyName: data.companyName,
            productInterest: data.productInterest,
            message: `${fullMessage}${attachmentNotes}`,
          },
        });
      } else {
        throw dbErr;
      }
    }

    const safeName = escapeHtml(data.name);
    const safeInterest = escapeHtml(data.productInterest);
    const safeMessage = escapeHtml(fullMessage).replace(/\n/g, '<br />');
    const safePhone = escapeHtml(data.phone);
    const safeEmail = escapeHtml(data.email);
    const safeCompany = escapeHtml(data.companyName || 'N/A');

    const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || 'https://autopacbd.com').replace(/\/$/, '');
    const attachmentsHtml = data.attachments.length
      ? `<p><strong>Attachments (${data.attachments.length}):</strong></p><ul>${data.attachments
          .map(
            (a) =>
              `<li><a href="${siteBase}${escapeHtml(a.url)}">${escapeHtml(a.name)}</a></li>`
          )
          .join('')}</ul>`
      : '';

    const clientMailOptions = {
      from: `"AutoPac Support" <${process.env.SMTP_FROM || 'support@autopacbd.com'}>`,
      to: data.email,
      subject: 'Quotation Request Received - AutoPac',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #6D1A2D;">Auto Pac Machinery</h2>
          <p>Dear ${safeName},</p>
          <p>Thank you for requesting a quotation for <strong>${safeInterest}</strong>.</p>
          <p>We have received your requirements and our technical team will review them shortly. One of our representatives will contact you within 24 hours.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            <strong>Your Requirements:</strong><br />
            ${safeMessage}
          </p>
          ${attachmentsHtml}
          <br/>
          <p>Best Regards,<br/><strong>Auto Pac Engineering & Sales Team</strong></p>
        </div>
      `,
    };

    const adminMailOptions = {
      from: `"System Alert" <${process.env.SMTP_FROM || 'system@autopacbd.com'}>`,
      to: process.env.ADMIN_EMAIL || 'autopacbd@gmail.com',
      subject: `New Quotation Request from ${data.name.replace(/[\r\n]/g, ' ')}`,
      html: `
        <h2>New Lead Alert</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Product Interest:</strong> ${safeInterest}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px;">${safeMessage}</blockquote>
        ${attachmentsHtml}
      `,
    };

    if (process.env.SMTP_HOST) {
      try {
        await Promise.all([
          transporter.sendMail(clientMailOptions),
          transporter.sendMail(adminMailOptions),
        ]);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    return NextResponse.json({ success: true, quote });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    console.error('Quote submit error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const quotes = await prisma.quotationRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(quotes);
  } catch (e: unknown) {
    console.error('Fetch Quotes Error:', e);
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Fetch failed',
        message,
      },
      { status: 500 }
    );
  }
}
