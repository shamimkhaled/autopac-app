export default function RootLoading() {
  return (
    <div className="page-shell">
      <div className="h-[min(68vh,560px)] min-h-[420px] bg-stone-200 dark:bg-stone-900" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="h-7 bg-stone-200 dark:bg-stone-800 rounded w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
