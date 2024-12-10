import MapAnalysisBlock from "@/components/analysis-blocks/MapAnalysisBlock";

export default function MapGallery({ analyses }) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:gap-6 mb-4">
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
