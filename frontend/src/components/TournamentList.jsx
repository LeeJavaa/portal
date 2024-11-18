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
  if (!currentAnalyses || currentAnalyses.length === 0) {
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>No analyses data available</AlertDescription>
      </Alert>
    );
  }

  return currentAnalyses.map((tournamentData) => (
    <Tournament
      key={tournamentData.tournament_title}
      tournamentId={tournamentData.tournament_title}
      tournamentData={{
        tournamentName: tournamentData.tournament_title,
        maps: showSeries ? [] : tournamentData.maps,
        series: showSeries ? tournamentData.series : [],
      }}
      showSeries={showSeries}
      expandedTournaments={expandedTournaments}
      toggleExpanded={toggleExpanded}
      selectionMode={selectionMode}
      selectedAnalyses={selectedAnalyses}
      toggleAnalysisSelection={toggleAnalysisSelection}
    />
  ));
}
