import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore AutoPac completed and ongoing industrial machinery installation projects across Bangladesh.',
};

export default function ProjectsPage() {
  return (
    <main className="page-shell">
      <PageHero
        kicker="Installations"
        title="Factory projects"
        description="A record of completed and ongoing machinery installations across Bangladesh. This section is being updated."
        actions={
          <>
            <Link href="/products" className="btn-primary">
              Browse machinery <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn-secondary">
              Request a quote
            </Link>
          </>
        }
      />
    </main>
  );
}
