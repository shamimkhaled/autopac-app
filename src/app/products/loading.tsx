export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 animate-pulse">
      {/* Page header skeleton */}
      <div className="h-48 sm:h-64 bg-gray-100 dark:bg-slate-900" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-72 shrink-0 space-y-4">
            <div className="h-10 bg-gray-100 dark:bg-slate-800 rounded-2xl" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
          {/* Products grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800">
                  <div className="aspect-[4/3] bg-gray-100 dark:bg-slate-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-100 dark:bg-slate-800 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full" />
                    <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full w-2/3" />
                    <div className="flex gap-3 pt-2">
                      <div className="h-9 flex-1 bg-gray-100 dark:bg-slate-800 rounded-xl" />
                      <div className="h-9 flex-1 bg-gray-100 dark:bg-slate-800 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
