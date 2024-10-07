'use client';
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalysisBlock from "@/components/AnalysisBlock";
import analysesData from "@/mock/mapAnalysis.json";
import tournamentsData from "@/mock/tournament.json";

export default function Home() {
  const analyses = analysesData.mapAnalyses;
  const tournaments = tournamentsData.tournaments;

  const [expandedTournaments, setExpandedTournaments] = useState({});

  // Group maps by tournament
  const mapAnalysesByTournament = tournaments.reduce((acc, tournament) => {
    acc[tournament.id] = {
      tournament: tournament,
      analyses: analyses.filter(analysis => analysis.tournament === tournament.id)
    };
    return acc;
  }, {})

  const toggleExpanded = (tournamentId) => {
    setExpandedTournaments(prev => ({
      ...prev,
      [tournamentId]: !prev[tournamentId]
    }));
  };
  
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
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
                  {analyses.slice(0, 4).map((analysis) => (
                    <AnalysisBlock key={analysis.id} analysis={analysis} />
                  ))}
                </div>
                {analyses.length > 4 && (
                  <div className="mt-4">
                    {expandedTournaments[tournament.id] && (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6 mb-4">
                        {analyses.slice(4).map((analysis) => (
                          <AnalysisBlock key={analysis.id} analysis={analysis} />
                        ))}
                      </div>
                    )}
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => toggleExpanded(tournament.id)}
                        className="mt-2"
                      >
                        {expandedTournaments[tournament.id] ? 'Show Less' : 'Show More'}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </main>
  );
}
