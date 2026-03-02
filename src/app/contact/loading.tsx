export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 animate-pulse">
      <div className="h-56 sm:h-80 bg-gray-900 dark:bg-slate-900" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 bg-gray-100 dark:bg-slate-800 rounded-3xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-[600px] bg-gray-100 dark:bg-slate-800 rounded-[40px]" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-56 bg-gray-800 dark:bg-slate-800 rounded-[40px]" />
            <div className="h-80 bg-gray-100 dark:bg-slate-800 rounded-[40px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
