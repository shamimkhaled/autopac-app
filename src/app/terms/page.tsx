import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — Auto Pac',
  description: 'Read the terms and conditions for using the Auto Pac website and requesting machinery quotations.',
  alternates: { canonical: 'https://autopacbd.com/terms' },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="bg-industrial-dark py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Terms of <span className="text-action-orange">Service</span>
          </h1>
          <p className="text-white/50 mt-4 text-sm font-medium">Last updated: January 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Auto Pac website (autopacbd.com), you agree to be bound by these Terms
            of Service. If you do not agree to these terms, please do not use the website.
          </p>

          <h2>2. Use of the Website</h2>
          <p>You may use this website for lawful purposes only. You agree not to:</p>
          <ul>
            <li>Submit false or misleading information via the quotation form</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Engage in automated scraping, spamming, or bot-driven requests</li>
            <li>Use the website in any way that could harm our systems or other users</li>
          </ul>

          <h2>3. Quotation Requests</h2>
          <p>
            Submitting a quotation request does not constitute a binding order. All quotations are provided as
            estimates only. Final pricing, delivery schedules, and technical specifications are subject to
            confirmation in a formal written agreement signed by both parties.
          </p>

          <h2>4. Product Information</h2>
          <p>
            While we strive to maintain accurate product listings and specifications on this website, errors may
            occur. Auto Pac reserves the right to correct any inaccuracies, omissions, or errors and to change or
            update information at any time without prior notice.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            All content on this website—including text, images, logos, and product descriptions—is the property
            of Auto Pac and is protected by copyright laws. You may not reproduce, distribute, or use any content
            without our written permission.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            Auto Pac shall not be liable for any indirect, incidental, or consequential damages arising from
            your use of this website or reliance on any information provided herein.
          </p>

          <h2>7. Governing Law</h2>
          <p>
            These terms are governed by the laws of the People's Republic of Bangladesh. Any disputes shall
            be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Continued use of the website after changes
            are posted constitutes your acceptance of the revised terms.
          </p>

          <h2>9. Contact</h2>
          <p>
            For questions about these terms, contact:<br />
            <strong>Auto Pac</strong><br />
            128/3 Kawran Bazar, Dhaka 1215, Bangladesh<br />
            Email: <a href="mailto:autopacbd@gmail.com">autopacbd@gmail.com</a>
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
