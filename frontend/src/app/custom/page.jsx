import { Suspense } from "react";
import { getCustomAnalyses } from "@/api/analyses";
import AnalysisGridLoading from "@/components/loading/AnalysisGridLoading";
import AnalysisGrid from "@/components/public-page/AnalysisGrid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

async function getData() {
  try {
    const analyses = await getCustomAnalyses();
    return { analyses, error: null };
  } catch (error) {
    return { analyses: [], error: error.message };
  }
}

export default async function CustomPage() {
  const { analyses, error } = await getData();
  const noAnalyses = !analyses || analyses.length === 0;

  if (error) {
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Your Custom Analyses
      </h1>
      {noAnalyses ? (
        <Alert>
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>No Custom Analyses</AlertTitle>
          <AlertDescription>
            You haven't created any custom analyses yet. Create a custom
            analysis by selecting multiple maps or series from the home page.
          </AlertDescription>
        </Alert>
      ) : (
        <Suspense fallback={<AnalysisGridLoading />}>
          <AnalysisGrid analyses={analyses} showCustoms={true} />
        </Suspense>
      )}
    </main>
  );
}
