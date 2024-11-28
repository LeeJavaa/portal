import { Skeleton } from "@/components/ui/skeleton";
import AnalysisGridLoading from "@/components/loading/AnalysisGridLoading";

export default function HomeContentLoading() {
  return (
    <div className="container py-8">
      {/* Filter bar skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Analysis grid skeleton */}
      <AnalysisGridLoading />
    </div>
  );
}
