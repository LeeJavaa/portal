import { Skeleton } from "@/components/ui/skeleton";

export default function SeriesAnalysisLoading() {
  return (
    <main className="w-full max-w-screen-xl mx-auto">
      {/* Title skeleton */}
      <Skeleton className="h-10 w-[60%] mx-auto mt-5 mb-8" />

      {/* MapGallery skeleton */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:gap-6 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="overflow-hidden">
            <div className="relative overflow-hidden rounded-lg">
              <Skeleton className="h-[105px] lg:h-[180px] w-full rounded-lg" />
            </div>
            <div className="mt-2">
              <Skeleton className="h-6 w-full mb-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Separator skeleton */}
      <Skeleton className="h-[1px] w-full mt-8" />

      {/* Filter bar skeleton */}
      <Skeleton className="h-[1px] w-full mt-8" />
      <div className="flex flex-col lg:flex-row lg:justify-between gap-y-6 lg:gap-y-0 mt-8">
        <div className="flex gap-x-2 items-center">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-36 lg:w-48" />
        </div>
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:gap-x-5">
          <Skeleton className="h-10 w-full lg:w-[180px]" />
          <Skeleton className="h-10 w-full lg:w-[180px]" />
          <Skeleton className="h-10 w-full lg:w-24" />
        </div>
        <div className="flex gap-x-5">
          <Skeleton className="h-10 w-full lg:w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </main>
  );
}
