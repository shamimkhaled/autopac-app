export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-100 rounded-2xl" />
          <div className="h-4 w-72 bg-gray-100 rounded-full" />
        </div>
        <div className="h-11 w-36 bg-gray-100 rounded-3xl" />
      </div>

      {/* Content card skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded-full" />
              <div className="h-3 bg-gray-100 rounded-full w-4/5" />
            </div>
            <div className="h-9 bg-gray-100 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="h-12 bg-gray-50 border-b border-gray-100" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-gray-100 rounded-full w-1/3" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            </div>
            <div className="h-8 w-20 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
