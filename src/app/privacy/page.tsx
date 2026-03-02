import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Auto Pac',
  description: 'Read Auto Pac\'s privacy policy to understand how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://autopacbd.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="bg-industrial-dark py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Privacy <span className="text-action-orange">Policy</span>
          </h1>
          <p className="text-white/50 mt-4 text-sm font-medium">Last updated: January 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            When you submit a quotation request or subscribe to our newsletter, we collect your name, phone number,
            email address, company name, and message. This information is used solely to respond to your inquiry
            or send relevant updates about our products and services.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information you provide to:</p>
          <ul>
            <li>Respond to quotation requests and technical inquiries</li>
            <li>Send relevant product updates and industry news (newsletter subscribers only)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. Your data may be shared
            with email service providers (e.g., for transactional emails) solely for the purpose of delivering
            our services to you.
          </p>

          <h2>4. Data Retention</h2>
          <p>
            Quotation request data is retained for up to 2 years to support follow-up communications. Newsletter
            subscription data is retained until you unsubscribe. You may request deletion of your data at any time
            by contacting us at <a href="mailto:autopacbd@gmail.com">autopacbd@gmail.com</a>.
          </p>

          <h2>5. Cookies</h2>
          <p>
            Our website uses essential session cookies for authentication and analytics cookies (Google Analytics)
            to understand site usage. Analytics cookies are only activated if you have given consent.
          </p>

          <h2>6. Security</h2>
          <p>
            We implement industry-standard security measures including HTTPS encryption, input validation,
            and rate limiting to protect your personal data from unauthorized access.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data at any time. To exercise
            these rights, please contact us using the information below.
          </p>

          <h2>8. Contact</h2>
          <p>
            For privacy-related questions, contact:<br />
            <strong>Auto Pac</strong><br />
            128/3 Kawran Bazar, Dhaka 1215, Bangladesh<br />
            Email: <a href="mailto:autopacbd@gmail.com">autopacbd@gmail.com</a><br />
            Phone: +880 1631769707
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-action-orange font-bold text-sm hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
