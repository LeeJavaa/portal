"use client";
import { useState } from "react";
import mapData from "@/mock/mapAnalysis.json";
import seriesData from "@/mock/seriesAnalysis.json";
import TournamentList from "@/components/TournamentList";
import ControlMenu from "@/components/ControlMenu";
import SelectionMenu from "@/components/SelectionMenu";

export default function Home() {
  const [showSeries, setShowSeries] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [activeFilters, setActiveFilters] = useState(0);
  const [expandedTournaments, setExpandedTournaments] = useState({});

  const mapAnalysesByTournament = mapData.mapAnalysesByTournament;
  const seriesAnalysesByTournament = seriesData.seriesAnalysesByTournament;

  const toggleExpanded = (tournamentId) => {
    setExpandedTournaments((prev) => ({
      ...prev,
      [tournamentId]: !prev[tournamentId],
    }));
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedAnalyses([]);
    }
  };

  const toggleAnalysisSelection = (analysis) => {
    setSelectedAnalyses((prev) => {
      const isSelected = prev.some((a) => a.id === analysis.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== analysis.id);
      } else {
        return [...prev, analysis];
      }
    });
  };

  const handleApplyFilter = () => {
    // Implement filter logic here
    console.log("Applying filters");
    // For now, let's just increment the active filters count
    setActiveFilters((prev) => prev + 1);
  };

  const currentAnalyses = showSeries
    ? seriesAnalysesByTournament
    : mapAnalysesByTournament;

  return (
    <main className="container py-8">
      <ControlMenu
        showSeries={showSeries}
        setShowSeries={setShowSeries}
        toggleSelectionMode={toggleSelectionMode}
        selectionMode={selectionMode}
        activeFilters={activeFilters}
        handleApplyFilter={handleApplyFilter}
      />
      <TournamentList
        currentAnalyses={currentAnalyses}
        showSeries={showSeries}
        expandedTournaments={expandedTournaments}
        toggleExpanded={toggleExpanded}
        selectionMode={selectionMode}
        selectedAnalyses={selectedAnalyses}
        toggleAnalysisSelection={toggleAnalysisSelection}
      />
      {selectionMode && (
        <SelectionMenu
          selectedAnalyses={selectedAnalyses}
          showSeries={showSeries}
        />
      )}
    </main>
  );
}
