import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525', 10),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(`newsletter:${ip}`, 2, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    // Notify admin of new subscriber
    try {
      await transporter.sendMail({
        from: `"AutoPac System" <${process.env.SMTP_FROM || 'system@autopacbd.com'}>`,
        to: process.env.ADMIN_EMAIL || 'autopacbd@gmail.com',
        subject: 'New Newsletter Subscriber',
        html: `<p>A new subscriber has joined the AutoPac weekly digest:</p><p><strong>${email}</strong></p>`,
      });
    } catch (emailErr) {
      console.error('Newsletter notification email failed:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Subscription failed' }, { status: 500 });
  }
}
