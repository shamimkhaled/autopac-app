export default function GalleryLoading() {
  return (
    <div className="page-shell">
      <div className="h-44 sm:h-52 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-36 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="surface-card aspect-[4/3] bg-stone-100 dark:bg-stone-800" />
          ))}
        </div>
      </div>
    </div>
  );
}
