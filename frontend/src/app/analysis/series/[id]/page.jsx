"use client";
import playerMapPerformances from "@/mock/playerMapPerformance.json";
import mapAnalyses from "@/mock/mapAnalysis.json";
import FilterBar from "@/components/analysis-pages/FilterBar";
import DataVis from "@/components/analysis-pages/DataVis";
import { Separator } from "@/components/ui/separator";
import MapGallery from "@/components/analysis-pages/MapGallery";

export default function () {
  const playerPerformanceData =
    playerMapPerformances.playerMapPerformances.filter(
      (performance) => performance.mapAnalysis === 3
    );

  const mapAnalysesData = mapAnalyses.mapAnalyses.filter(
    (analysis) => analysis.seriesAnalysis === 1
  );

  const mapMetadata = mapAnalyses.mapAnalyses.filter(
    (mapAnalysis) => mapAnalysis.id === 2
  )[0];

  return (
    <main className="w-full max-w-screen-xl mx-auto">
      <h1 className="text-center text-3xl font-bold mt-5 mb-8">
        OpTic vs NYSL Champs GF
      </h1>
      <MapGallery analyses={mapAnalysesData} />
      <Separator className="mt-8" />
      <FilterBar mapAnalysis={false} />
      <DataVis
        playerPerformanceData={playerPerformanceData}
        mapMetadata={mapMetadata}
      />
    </main>
  );
}
