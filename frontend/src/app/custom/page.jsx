import { Suspense } from "react";
import { getCustomAnalyses } from "@/api/analyses";
import AnalysisGrid from "@/components/AnalysisGrid";
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
      <Suspense fallback={<div>Loading...</div>}>
        <AnalysisGrid analyses={analyses} showCustoms={true} />
      </Suspense>
    </main>
  );
}
