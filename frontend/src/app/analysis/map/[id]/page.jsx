import { Suspense } from "react";
import { getMapAnalysis, getScoreboardUrl } from "@/api/analysis";
import MapLoading from "@/components/analysis-page/MapLoading";
import FilterBar from "@/components/analysis-page/FilterBar";
import MetaDescription from "@/components/analysis-page/MetaDescription";
import StaticScoreboard from "@/components/StaticScoreboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { TriangleAlert } from "lucide-react";

export default async function Page({ params, searchParams }) {
  let mapAnalysis;
  let scoreboardUrl;
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
    mapAnalysis = await getMapAnalysis(params.id, filters);

    if (mapAnalysis.screenshot) {
      scoreboardUrl = await getScoreboardUrl(mapAnalysis.screenshot);
      console.log(scoreboardUrl);
    }
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
    <Suspense fallback={<MapLoading />}>
      <main className="w-full max-w-screen-xl mx-auto">
        <h1 className="text-center text-3xl font-bold mt-5 mb-8">
          {mapAnalysis.title}
        </h1>
        <MetaDescription data={mapAnalysis} />
        <StaticScoreboard
          playerData={mapAnalysis.player_performance_data}
          caption=""
          gameMode={mapAnalysis.game_mode}
        />
        <Separator className="mt-8" />
        <FilterBar data={mapAnalysis} scoreboardUrl={scoreboardUrl} />
      </main>
    </Suspense>
  );
}
{
  /* <MetaDescription />
      <StaticScoreboard playerData={} caption="" gameMode="hp" />
      <Separator className="mt-8" />
      <FilterBar />
      <DataVis /> */
}
