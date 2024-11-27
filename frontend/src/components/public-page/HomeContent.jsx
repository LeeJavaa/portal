"use client";
import { useState } from "react";
import ControlMenu from "@/components/public-page/ControlMenu";
import TournamentList from "@/components/public-page/TournamentList";
import SelectionMenu from "@/components/public-page/SelectionMenu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export default function HomeContent({
  mapData,
  seriesData,
  initialShowSeries,
  initialActiveFilters,
}) {
  const [showSeries, setShowSeries] = useState(initialShowSeries);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [activeFilters, setActiveFilters] = useState(initialActiveFilters);
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

  const handleApplyFilter = (filterCount) => {
    setActiveFilters(filterCount);
  };

  const handleShowSeriesChange = (value) => {
    setShowSeries(value);
    document.cookie = `showSeries=${value}; path=/; max-age=31536000`;
  };

  const currentAnalyses = showSeries ? seriesData : mapData;
  const noDataAvailable = !currentAnalyses || currentAnalyses.length === 0;

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
      {noDataAvailable ? (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            {showSeries
              ? "No series analyses found. Try switching to map view or adjusting your filters."
              : "No map analyses found. Try switching to series view or adjusting your filters."}
          </AlertDescription>
        </Alert>
      ) : (
        <TournamentList
          currentAnalyses={currentAnalyses}
          showSeries={showSeries}
          expandedTournaments={expandedTournaments}
          toggleExpanded={toggleExpanded}
          selectionMode={selectionMode}
          selectedAnalyses={selectedAnalyses}
          toggleAnalysisSelection={toggleAnalysisSelection}
        />
      )}
      {selectionMode && (
        <SelectionMenu
          selectedAnalyses={selectedAnalyses}
          showSeries={showSeries}
        />
      )}
    </>
  );
}
