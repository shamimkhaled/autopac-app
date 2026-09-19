import type { ReactNode } from 'react';

interface SectionHeaderProps {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export default function SectionHeader({
  kicker,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 sm:mb-10">
      <div className="max-w-2xl">
        <p className="section-kicker mb-3">{kicker}</p>
        <h2 className="page-title">{title}</h2>
        {description && <p className="section-lede mt-3">{description}</p>}
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
}
