import { Suspense } from "react";
import { getCustomAnalysis } from "@/api/analysis";
import DataVis from "@/components/analysis-pages/DataVis";
import FilterBar from "@/components/analysis-pages/FilterBar";
import MapsetTable from "@/components/analysis-pages/MapsetTable";
import CustomAnalysisLoading from "@/components/loading/CustomAnalysisLoading";
import { Separator } from "@/components/ui/separator";

export default async function Page({ params, searchParams }) {
  let custom_analysis;
  let error;

  const getFiltersFromSearchParams = (searchParams) => {
    const filters = {};
    if (searchParams.team) {
      filters.team = searchParams.team;
    }
    if (searchParams.players) {
      filters.players = searchParams.players.split(",");
    }
    return filters;
  };

  try {
    const filters = getFiltersFromSearchParams(searchParams);
    custom_analysis = await getCustomAnalysis(params.id, filters);
  } catch (e) {
    error = e.message;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4 mb-4 b-2">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="font-medium">{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Suspense fallback={<CustomAnalysisLoading />}>
      <main className="w-full max-w-screen-xl mx-auto">
        <h1 className="text-center text-3xl font-bold mt-5 mb-8">
          {custom_analysis.title}
        </h1>
        <MapsetTable data={custom_analysis} />
        <Separator />
        <FilterBar data={custom_analysis} customAnalysis={true} />
        <DataVis />
      </main>
    </Suspense>
  );
}
