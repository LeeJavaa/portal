import { Suspense } from "react";
import { getMapAnalyses, getSeriesAnalyses } from "@/api/analyses";
import HomeContent from "@/components/public-page/HomeContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { cookies } from "next/headers";

async function getData() {
  try {
    const [mapData, seriesData] = await Promise.all([
      getMapAnalyses(),
      getSeriesAnalyses(),
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

export default async function Home() {
  const { mapData, seriesData, error } = await getData();

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
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent
          mapData={mapData}
          seriesData={seriesData}
          initialShowSeries={initialShowSeries}
        />
      </Suspense>
    </main>
  );
}
