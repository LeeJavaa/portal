import { Skeleton } from "@/components/ui/skeleton";

export default function AnalysisGridLoading() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6 mb-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="overflow-hidden">
          <div className="relative overflow-hidden rounded-lg">
            <Skeleton className="w-full h-[150px] rounded-lg" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-2/3 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
