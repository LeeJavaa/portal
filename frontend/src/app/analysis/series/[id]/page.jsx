import { Suspense } from "react";
import { getSeriesAnalysis } from "@/api/analysis";
import DataVis from "@/components/analysis-pages/DataVis";
import FilterBar from "@/components/analysis-pages/FilterBar";
import MapGallery from "@/components/analysis-pages/MapGallery";
import SeriesAnalysisLoading from "@/components/loading/SeriesAnalysisLoading";
import { Separator } from "@/components/ui/separator";

export default async function Page({ params, searchParams }) {
  let series_analysis;
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
    series_analysis = await getSeriesAnalysis(params.id, filters);
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
    <Suspense fallback={<SeriesAnalysisLoading />}>
      <main className="w-full max-w-screen-xl mx-auto">
        <h1 className="text-center text-3xl font-bold mt-5 mb-8">
          {series_analysis.title}
        </h1>
        <MapGallery analyses={series_analysis.maps} />
        <Separator className="mt-8" />
        <FilterBar data={series_analysis} seriesAnalysis={true} />
        <DataVis />
      </main>
    </Suspense>
  );
}
