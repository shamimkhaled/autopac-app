export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 animate-pulse">
      <div className="h-56 sm:h-72 bg-gray-900 dark:bg-slate-900" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-gray-100 dark:bg-slate-800 rounded-full flex-shrink-0" />
          ))}
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 dark:bg-slate-800 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
