"use client";

export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative h-64 bg-slate-200 animate-pulse">
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="w-12 h-6 bg-slate-300 rounded-lg" />
          <div className="w-16 h-6 bg-slate-300 rounded-lg" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="w-24 h-3 bg-slate-100 rounded mb-3 animate-pulse" />
        <div className="w-3/4 h-6 bg-slate-200 rounded mb-2 animate-pulse" />
        <div className="w-1/2 h-8 bg-slate-200 rounded mb-6 animate-pulse" />
        
        <div className="mt-auto grid grid-cols-4 gap-2 border-t border-slate-100 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-8 h-2 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
