import MapAnalysisBlock from "@/components/analysis-blocks/MapAnalysisBlock";
import SeriesAnalysisBlock from "@/components/analysis-blocks/SeriesAnalysisBlock";
import CustomAnalysisBlock from "@/components/analysis-blocks/CustomAnalysisBlock";

export default function AnalysisGrid({
  analyses,
  showCustoms,
  showSeries,
  selectionMode,
  selectedAnalyses,
  toggleAnalysisSelection,
}) {
  const renderAnalysisBlock = (analysis) => {
    const commonProps = {
      key: analysis.id,
      analysis: analysis,
    };

    if (showCustoms) {
      return <CustomAnalysisBlock {...commonProps} />;
    }

    if (showSeries) {
      return (
        <SeriesAnalysisBlock
          {...commonProps}
          selectionMode={selectionMode}
          isSelected={selectedAnalyses.some((a) => a.id === analysis.id)}
          onSelect={() => toggleAnalysisSelection(analysis)}
        />
      );
    }

    return (
      <MapAnalysisBlock
        {...commonProps}
        selectionMode={selectionMode}
        isSelected={selectedAnalyses.some((a) => a.id === analysis.id)}
        onSelect={() => toggleAnalysisSelection(analysis)}
      />
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6 mb-4">
      {analyses.map(renderAnalysisBlock)}
    </div>
  );
}
