import { Suspense } from "react";
import { cookies } from "next/headers";
import { getMapAnalyses, getSeriesAnalyses } from "@/api/analyses";
import HomeContentLoading from "@/components/loading/HomeContentLoading";
import HomeContent from "@/components/public-page/HomeContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

async function getData(searchParams) {
  const filters = {
    tournament: searchParams.tournament || undefined,
    game_mode: searchParams.game_mode || undefined,
    map: searchParams.map || undefined,
    team_one: searchParams.team_one || undefined,
    team_two: searchParams.team_two || undefined,
    player: searchParams.player || undefined,
  };

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined)
  );

  try {
    const [mapData, seriesData] = await Promise.all([
      getMapAnalyses(cleanFilters),
      getSeriesAnalyses(cleanFilters),
    ]);

    return {
      mapData,
      seriesData,
      error: null,
    };
  } catch (error) {
    return {
      mapData: [],
      seriesData: [],
      error: error.message,
    };
  }
}

export default async function Home({ searchParams }) {
  const { mapData, seriesData, error } = await getData(searchParams);
  const activeFilters = Object.keys(searchParams).length;

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4 mb-4 b-2">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="font-medium">{error}</AlertDescription>
      </Alert>
    );
  }

  const cookieStore = cookies();
  const showSeriesCookie = cookieStore.get("showSeries");
  const initialShowSeries = showSeriesCookie
    ? showSeriesCookie.value === "true"
    : false;

  return (
    <main className="container py-8">
      <Suspense fallback={<HomeContentLoading />}>
        <HomeContent
          mapData={mapData}
          seriesData={seriesData}
          initialShowSeries={initialShowSeries}
          initialActiveFilters={activeFilters}
        />
      </Suspense>
    </main>
  );
}
