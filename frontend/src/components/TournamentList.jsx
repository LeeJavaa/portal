import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import Tournament from "@/components/Tournament";

export default function TournamentList({
  currentAnalyses,
  showSeries,
  expandedTournaments,
  toggleExpanded,
  selectionMode,
  selectedAnalyses,
  toggleAnalysisSelection,
}) {
  if (Object.keys(currentAnalyses).length === 0) {
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>No analyses data available</AlertDescription>
      </Alert>
    );
  }

  return Object.entries(currentAnalyses).map(
    ([tournamentId, tournamentData]) => (
      <Tournament
        key={tournamentId}
        tournamentId={tournamentId}
        tournamentData={tournamentData}
        showSeries={showSeries}
        expandedTournaments={expandedTournaments}
        toggleExpanded={toggleExpanded}
        selectionMode={selectionMode}
        selectedAnalyses={selectedAnalyses}
        toggleAnalysisSelection={toggleAnalysisSelection}
      />
    )
  );
}
