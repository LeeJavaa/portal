import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import AnalysisBlock from "@/components/AnalysisBlock";
import analysesData from "@/mock/mapAnalysis.json";
import tournamentsData from "@/mock/tournament.json";

export default function Home() {
  const analyses = analysesData.mapAnalyses;
  const tournaments = tournamentsData.tournaments;

  // Group maps by tournament
  const mapAnalysesByTournament = tournaments.reduce((acc, tournament) => {
    acc[tournament.id] = {
      tournament: tournament,
      analyses: analyses.filter(analysis => analysis.tournament === tournament.id)
    };
    return acc;
  }, {})
  
  return (
    <main className="container px-4 py-8 max-w-screen-xl mx-auto">
      {analyses.length === 0 ? (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No analyses data available</AlertDescription>
        </Alert>
      ) : (
        Object.values(mapAnalysesByTournament).map(({ tournament, analyses }) => (
          <div key={tournament.id} className="mb-8">
            <h2 className="text-3xl font-bold mb-4">{tournament.title}</h2>
            {analyses.length === 0 ? (
              <p>No analyses available for this tournament.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
                {analyses.map((analysis) => (
                  <AnalysisBlock key={analysis.id} analysis={analysis} />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </main>
  );
}
