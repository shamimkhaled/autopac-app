import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HardHat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore AutoPac completed and ongoing industrial machinery installation projects across Bangladesh.',
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <section className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-action-orange to-transparent opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-action-orange/10 mb-8">
            <HardHat className="w-10 h-10 text-action-orange" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">
            Our <span className="text-action-orange">Projects</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-10">
            A showcase of our completed and ongoing industrial machinery installations
            across Bangladesh. This section is currently being updated — check back soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-action-orange text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/20 hover:-translate-y-1"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-action-orange transition-all hover:-translate-y-1"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
