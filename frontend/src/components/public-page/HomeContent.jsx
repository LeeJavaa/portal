"use client";
import { useState } from "react";
import ControlMenu from "@/components/ControlMenu";
import SelectionMenu from "@/components/SelectionMenu";
import TournamentList from "@/components/TournamentList";

export default function HomeContent({
  mapData,
  seriesData,
  initialShowSeries,
}) {
  const [showSeries, setShowSeries] = useState(initialShowSeries);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [activeFilters, setActiveFilters] = useState(0);
  const [expandedTournaments, setExpandedTournaments] = useState({});

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
    setActiveFilters((prev) => prev + 1);
  };

  const handleShowSeriesChange = (value) => {
    setShowSeries(value);
    document.cookie = `showSeries=${value}; path=/; max-age=31536000`;
  };

  const currentAnalyses = showSeries ? seriesData : mapData;

  return (
    <>
      <ControlMenu
        showSeries={showSeries}
        setShowSeries={handleShowSeriesChange}
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
    </>
  );
}
