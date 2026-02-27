import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import nodemailer from 'nodemailer';

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
  try {
    const body = await req.json();
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

    // Email Automation - Autoresponder to Client
    const clientMailOptions = {
      from: `"AutoPac Support" <${process.env.SMTP_FROM || 'support@autopacbd.com'}>`,
      to: data.email,
      subject: 'Quotation Request Received - AutoPac',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">AutoPac Machinery</h2>
          <p>Dear ${data.name},</p>
          <p>Thank you for requesting a quotation for <strong>${data.productInterest}</strong>.</p>
          <p>We have received your requirements and our technical team will review them shortly. One of our representatives will contact you within 24 hours.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            <strong>Your Message:</strong><br />
            ${data.message}
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
      subject: `New Quotation Request from ${data.name}`,
      html: `
        <h2>New Lead Alert</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.companyName || 'N/A'}</p>
        <p><strong>Product Interest:</strong> ${data.productInterest}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px;">${data.message}</blockquote>
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
