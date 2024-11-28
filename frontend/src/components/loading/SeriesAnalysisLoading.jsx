import { Skeleton } from "@/components/ui/skeleton";

export default function SeriesAnalysisLoading() {
  return (
    <main className="w-full max-w-screen-xl mx-auto">
      {/* Title skeleton */}
      <Skeleton className="h-10 w-[60%] mx-auto mt-5 mb-8" />

      {/* MapGallery skeleton */}
      <div className="flex gap-x-6 justify-center">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="overflow-hidden">
            <div className="relative overflow-hidden rounded-lg">
              <Skeleton className="h-[150px] w-[300px] rounded-lg" />
            </div>
            <div className="mt-2">
              <Skeleton className="h-6 w-[200px] mb-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Separator skeleton */}
      <Skeleton className="h-[1px] w-full mt-8" />

      {/* FilterBar skeleton */}
      <div className="flex justify-between mt-8">
        <div className="flex gap-x-2 items-center">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-x-5">
          {/* Team and Player select skeletons */}
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          {/* Filter buttons skeleton */}
          <div className="flex gap-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="flex gap-x-5">
          {/* Preview and Delete button skeletons */}
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </main>
  );
}
