import AnalysisBlock from "@/components/AnalysisBlock";

export default function AnalysisGrid({
  analyses,
  selectionMode,
  selectedAnalyses,
  toggleAnalysisSelection,
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6 mb-4">
      {analyses.map((analysis) => (
        <AnalysisBlock
          key={analysis.id}
          analysis={analysis}
          selectionMode={selectionMode}
          isSelected={selectedAnalyses.some((a) => a.id === analysis.id)}
          onSelect={() => toggleAnalysisSelection(analysis)}
        />
      ))}
    </div>
  );
}
