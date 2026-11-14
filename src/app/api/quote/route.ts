import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z, ZodError } from 'zod';
import nodemailer from 'nodemailer';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { escapeHtml } from '@/lib/cmsSchemas';
import { requireAdmin } from '@/lib/requireAdmin';

const quoteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  companyName: z.string().optional(),
  productInterest: z.string().min(2, 'Product interest is required'),
  message: z.string().min(10, 'Message is too short'),
});

// Configure Nodemailer transporter (Fallback to generic dev transport if env missing)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525', 10),
  auth: {
    user: process.env.SMTP_USER || 'test_user',
    pass: process.env.SMTP_PASS || 'test_pass',
  },
});

export async function POST(req: Request) {
  // Rate limit: max 3 quote submissions per minute per IP
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(`quote:${ip}`, 3, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait before submitting again.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
    );
  }

  try {
    const body = await req.json();

    // Honeypot check — bots fill hidden fields, humans don't
    if (body._hp) {
      return NextResponse.json({ success: true }); // Silently accept (fool bots)
    }

    const data = quoteSchema.parse(body);

    // Save to Database
    const quote = await prisma.quotationRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        companyName: data.companyName,
        productInterest: data.productInterest,
        message: data.message,
      },
    });

    const safeName = escapeHtml(data.name);
    const safeInterest = escapeHtml(data.productInterest);
    const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br />');
    const safePhone = escapeHtml(data.phone);
    const safeEmail = escapeHtml(data.email);
    const safeCompany = escapeHtml(data.companyName || 'N/A');

    // Email Automation - Autoresponder to Client
    const clientMailOptions = {
      from: `"AutoPac Support" <${process.env.SMTP_FROM || 'support@autopacbd.com'}>`,
      to: data.email,
      subject: 'Quotation Request Received - AutoPac',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">AutoPac Machinery</h2>
          <p>Dear ${safeName},</p>
          <p>Thank you for requesting a quotation for <strong>${safeInterest}</strong>.</p>
          <p>We have received your requirements and our technical team will review them shortly. One of our representatives will contact you within 24 hours.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            <strong>Your Message:</strong><br />
            ${safeMessage}
          </p>
          <br/>
          <p>Best Regards,<br/><strong>AutoPac Sales Team</strong></p>
        </div>
      `,
    };

    // Email Automation - Notification to Admin
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
      `,
    };

    // Attempt to send emails (fail silently if SMTP not configured correctly to not break the UI)
    try {
      await Promise.all([
        transporter.sendMail(clientMailOptions),
        transporter.sendMail(adminMailOptions)
      ]);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return NextResponse.json({ success: true, quote });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
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
    return NextResponse.json({ 
      error: 'Fetch failed',
      message,
    }, { status: 500 });
  }
}
