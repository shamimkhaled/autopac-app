export default function RootLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[65vh] min-h-[400px] bg-gray-100 dark:bg-slate-900" />
      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-16 space-y-8">
        <div className="h-8 bg-gray-100 dark:bg-slate-800 rounded-2xl w-1/3 mx-auto" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 dark:bg-slate-800 rounded-3xl" />
          ))}
        </div>
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded-full" />
          <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded-full w-4/5 mx-auto" />
        </div>
      </div>
    </div>
  );
}
