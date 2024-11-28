import AnalysisGrid from "@/components/public-page/AnalysisGrid";
import { Button } from "@/components/ui/button";

export default function Tournament({
  tournamentId,
  tournamentData,
  showSeries,
  expandedTournaments,
  toggleExpanded,
  selectionMode,
  selectedAnalyses,
  toggleAnalysisSelection,
}) {
  const analysesType = showSeries ? "series" : "maps";
  const analyses = tournamentData[analysesType];

  return (
    <div key={tournamentId} className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {tournamentData.tournamentName}
      </h2>
      {analyses.length === 0 ? (
        <p>No analyses available for this tournament.</p>
      ) : (
        <>
          <AnalysisGrid
            analyses={analyses.slice(0, 4)}
            showSeries={showSeries}
            selectionMode={selectionMode}
            selectedAnalyses={selectedAnalyses}
            toggleAnalysisSelection={toggleAnalysisSelection}
          />
          {analyses.length > 4 && (
            <div className="mt-4">
              {expandedTournaments[tournamentId] && (
                <AnalysisGrid
                  analyses={analyses.slice(4)}
                  showSeries={showSeries}
                  selectionMode={selectionMode}
                  selectedAnalyses={selectedAnalyses}
                  toggleAnalysisSelection={toggleAnalysisSelection}
                />
              )}
              <div className="flex justify-center">
                <Button
                  onClick={() => toggleExpanded(tournamentId)}
                  variant="outline"
                  className="mt-4"
                >
                  {expandedTournaments[tournamentId]
                    ? "Show Less"
                    : "Show More"}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
