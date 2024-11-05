import MapAnalysisBlock from "@/components/analysis-blocks/MapAnalysisBlock";

export default function MapGallery({ analyses }) {
  return (
    <div className="flex gap-x-6">
      {analyses.map((analysis) => (
        <MapAnalysisBlock
          key={analysis.id}
          analysis={analysis}
          seriesGallery={true}
        />
      ))}
    </div>
  );
}
