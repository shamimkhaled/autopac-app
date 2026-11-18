import { ShieldCheck } from 'lucide-react';

const certifications = [
  {
    name: 'ISO 9001:2015',
    description: 'Quality Management System compliance for industrial food & chemical machinery.',
  },
  {
    name: 'CE Marking',
    description: 'European electrical safety & SS-304 hygienic engineering standards.',
  },
  {
    name: 'BSTI Ready Specs',
    description: 'Engineered for Bangladesh Standards & Testing Institution factory audits.',
  },
];

export default function QualityCertifications() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {certifications.map((cert) => (
        <div
          key={cert.name}
          className="surface-card p-5 flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-md bg-brand-maroon/10 dark:bg-brand-ink/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-brand-ink" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-white tracking-tight">
              {cert.name}
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-xs mt-1 leading-relaxed">
              {cert.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
