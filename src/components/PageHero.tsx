import type { ReactNode } from 'react';

interface PageHeroProps {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  align?: 'left' | 'center';
}

export default function PageHero({
  kicker,
  title,
  description,
  actions,
  align = 'left',
}: PageHeroProps) {
  return (
    <section className="bg-brand-paper dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div className="brand-rule" aria-hidden="true" />
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 ${
          align === 'center' ? 'text-center' : ''
        }`}
      >
        <p className="section-kicker mb-3">{kicker}</p>
        <h1 className={`page-title ${align === 'center' ? 'mx-auto' : ''} max-w-3xl`}>
          {title}
        </h1>
        {description && (
          <p
            className={`section-lede mt-4 ${align === 'center' ? 'mx-auto' : ''}`}
          >
            {description}
          </p>
        )}
        {actions && (
          <div
            className={`mt-7 flex flex-wrap gap-3 ${
              align === 'center' ? 'justify-center' : ''
            }`}
          >
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
