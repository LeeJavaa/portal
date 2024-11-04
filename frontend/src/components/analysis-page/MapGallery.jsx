import AnalysisBlock from "@/components/AnalysisBlock";

export default function MapGallery({ analyses }) {
  return (
    <div className="flex gap-x-6">
      {analyses.map((analysis) => (
        <AnalysisBlock
          key={analysis.id}
          analysis={analysis}
          seriesGallery={true}
        />
      ))}
    </div>
  );
}
