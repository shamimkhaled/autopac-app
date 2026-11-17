export default function ContactLoading() {
  return (
    <div className="page-shell">
      <div className="h-44 sm:h-52 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="surface-card h-28" />
          ))}
        </div>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 surface-card h-[480px]" />
          <div className="lg:col-span-5 space-y-5">
            <div className="h-44 bg-brand-maroon/20 rounded-md" />
            <div className="surface-card h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
