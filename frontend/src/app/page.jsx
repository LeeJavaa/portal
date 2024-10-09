'use client';
import { useState } from "react";
import AnalysisBlock from "@/components/AnalysisBlock";
import FilterSheet from "@/components/FilterSheet";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import mapData from "@/mock/mapAnalysis.json";
import seriesData from "@/mock/seriesAnalysis.json";
import tournamentsData from "@/mock/tournament.json";

export default function Home() {
  const mapAnalyses = mapData.mapAnalyses;
  const seriesAnalyses = seriesData.seriesAnalyses;
  const tournaments = tournamentsData.tournaments;

  const [expandedTournaments, setExpandedTournaments] = useState({});
  const [showSeries, setShowSeries] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [activeFilters, setActiveFilters] = useState(0);

  const groupAnalysesByTournament = (analyses) => {
    return tournaments.reduce((acc, tournament) => {
      acc[tournament.id] = {
        tournament: tournament,
        analyses: analyses.filter(analysis => analysis.tournament === tournament.id)
      };
      return acc;
    }, {});
  };

  const mapAnalysesByTournament = groupAnalysesByTournament(mapAnalyses);
  const seriesAnalysesByTournament = groupAnalysesByTournament(seriesAnalyses);

  const toggleExpanded = (tournamentId) => {
    setExpandedTournaments(prev => ({
      ...prev,
      [tournamentId]: !prev[tournamentId]
    }));
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedAnalyses([]);
    }
  };

  const toggleAnalysisSelection = (analysis) => {
    setSelectedAnalyses(prev => {
      const isSelected = prev.some(a => a.id === analysis.id);
      if (isSelected) {
        return prev.filter(a => a.id !== analysis.id);
      } else {
        return [...prev, analysis];
      }
    });
  };

  const handleApplyFilter = () => {
    // Implement filter logic here
    console.log("Applying filters");
    // For now, let's just increment the active filters count
    setActiveFilters(prev => prev + 1);
  };

  const currentAnalyses = showSeries ? seriesAnalysesByTournament : mapAnalysesByTournament;
  
  return (
    <main className="container px-4 py-8 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Toggle 
          onClick={toggleSelectionMode}
          variant={selectionMode ? "secondary" : "outline"}
        >
          {selectionMode ? "Cancel Selection" : "Select Analyses"}
        </Toggle>
        <div className="flex items-center space-x-2">
          <span>Show Series</span>
          <Switch
            checked={showSeries}
            onCheckedChange={setShowSeries}
          />
        </div>
      </div>

      {Object.keys(currentAnalyses).length === 0 ? (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No analyses data available</AlertDescription>
        </Alert>
      ) : (
        Object.values(currentAnalyses).map(({ tournament, analyses }) => (
          <div key={tournament.id} className="mb-8">
            <h2 className="text-3xl font-bold mb-4">{tournament.title}</h2>
            {analyses.length === 0 ? (
              <p>No analyses available for this tournament.</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
                  {analyses.slice(0, 4).map((analysis) => (
                    <AnalysisBlock 
                      key={analysis.id} 
                      analysis={analysis}
                      selectionMode={selectionMode}
                      isSelected={selectedAnalyses.some(a => a.id === analysis.id)}
                      onSelect={() => toggleAnalysisSelection(analysis)} 
                    />
                  ))}
                </div>
                {analyses.length > 4 && (
                  <div className="mt-4">
                    {expandedTournaments[tournament.id] && (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6 mb-4">
                        {analyses.slice(4).map((analysis) => (
                          <AnalysisBlock 
                            key={analysis.id} 
                            an alysis={analysis}
                            selectionMode={selectionMode}
                            isSelected={selectedAnalyses.some(a => a.id === analysis.id)}
                            onSelect={() => toggleAnalysisSelection(analysis)} 
                          /> 
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

      {selectionMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-border p-4 flex justify-between items-center">
          <div>
            Selected: {selectedAnalyses.length} analyses
          </div>
          <div>
            <Button
              onClick={() => {/* Handle create series analysis */}}
              disabled={showSeries}
              className="mr-2"
            >
              Create Series Analysis
            </Button>
            <Button
              onClick={() => {/* Handle create custom analysis */}}
            >
              Create Custom Analysis
            </Button>
          </div>
        </div>
      )}

      <FilterSheet activeFilters={activeFilters} onApplyFilter={handleApplyFilter} />
    </main>
  );
}
