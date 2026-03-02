import { ShieldCheck } from 'lucide-react';

const certifications = [
  { name: 'ISO 9001:2015', description: 'Quality Management System' },
  { name: 'CE Marking', description: 'European Conformity Standard' },
  { name: 'BSTI Certified', description: 'Bangladesh Standards & Testing Institution' },
];

export default function QualityCertifications() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {certifications.map((cert) => (
        <div
          key={cert.name}
          className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800"
        >
          <div className="w-10 h-10 rounded-xl bg-action-orange/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-action-orange" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{cert.name}</h4>
            <p className="text-gray-500 dark:text-slate-400 text-xs mt-0.5">{cert.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
