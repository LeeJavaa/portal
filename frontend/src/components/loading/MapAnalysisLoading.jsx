import { Skeleton } from "@/components/ui/skeleton";

export default function MapAnalysisLoading() {
  return (
    <main className="w-full max-w-screen-xl mx-auto">
      {/* Title skeleton */}
      <Skeleton className="h-10 w-[60%] mx-auto mt-5 mb-8" />

      {/* Meta description skeletons */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-4 w-[75%]" />
      </div>

      {/* Scoreboard skeleton */}
      <div className="border rounded-lg p-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>

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
