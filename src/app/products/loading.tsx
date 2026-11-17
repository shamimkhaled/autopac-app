export default function ProductsLoading() {
  return (
    <div className="page-shell">
      <div className="h-44 sm:h-52 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-72 shrink-0 space-y-3">
            <div className="h-11 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md" />
            <div className="h-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md" />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="surface-card overflow-hidden">
                <div className="aspect-[4/3] bg-stone-100 dark:bg-stone-800" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
                  <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
                  <div className="h-10 bg-stone-100 dark:bg-stone-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
