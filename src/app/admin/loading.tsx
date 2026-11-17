export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-stone-200 rounded" />
          <div className="h-4 w-72 bg-stone-200/70 rounded" />
        </div>
        <div className="h-11 w-36 bg-stone-200 rounded-md" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface-card p-5 space-y-3">
            <div className="w-10 h-10 bg-brand-paper rounded-md" />
            <div className="h-3 bg-stone-200 rounded w-1/2" />
            <div className="h-8 bg-stone-200 rounded w-1/3" />
          </div>
        ))}
      </div>

      <div className="surface-card overflow-hidden">
        <div className="h-11 bg-brand-paper border-b border-stone-200" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-stone-100 last:border-0">
            <div className="w-11 h-11 bg-stone-100 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-stone-200 rounded w-1/3" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
            </div>
            <div className="h-8 w-20 bg-stone-100 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
