import { Suspense } from "react";
import { getMapAnalyses, getSeriesAnalyses } from "@/api/analyses";
import HomeContent from "@/components/public-page/HomeContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { cookies } from "next/headers";

async function getData() {
  try {
    const [mapData, seriesData] = await Promise.all([
      getMapAnalyses(),
      getSeriesAnalyses(),
    ]);

    return {
      mapData,
      seriesData,
      error: null,
    };
  } catch (error) {
    return {
      mapData: [],
      seriesData: [],
      error: error.message,
    };
  }
}

export default async function Home() {
  const { mapData, seriesData, error } = await getData();

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4 mb-4 b-2">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="font-medium">{error}</AlertDescription>
      </Alert>
    );
  }

  const cookieStore = cookies();
  const showSeriesCookie = cookieStore.get("showSeries");
  const initialShowSeries = showSeriesCookie
    ? showSeriesCookie.value === "true"
    : false;

  return (
    <main className="container py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent
          mapData={mapData}
          seriesData={seriesData}
          initialShowSeries={initialShowSeries}
        />
      </Suspense>
    </main>
  );
}

// export default function Home() {
//   const [showSeries, setShowSeries] = useState(false);
//   const [selectionMode, setSelectionMode] = useState(false);
//   const [selectedAnalyses, setSelectedAnalyses] = useState([]);
//   const [activeFilters, setActiveFilters] = useState(0);
//   const [expandedTournaments, setExpandedTournaments] = useState({});

//   const mapAnalysesByTournament = mapData.mapAnalysesByTournament;
//   const seriesAnalysesByTournament = seriesData.seriesAnalysesByTournament;

//   const toggleExpanded = (tournamentId) => {
//     setExpandedTournaments((prev) => ({
//       ...prev,
//       [tournamentId]: !prev[tournamentId],
//     }));
//   };

//   const toggleSelectionMode = () => {
//     setSelectionMode(!selectionMode);
//     if (selectionMode) {
//       setSelectedAnalyses([]);
//     }
//   };

//   const toggleAnalysisSelection = (analysis) => {
//     setSelectedAnalyses((prev) => {
//       const isSelected = prev.some((a) => a.id === analysis.id);
//       if (isSelected) {
//         return prev.filter((a) => a.id !== analysis.id);
//       } else {
//         return [...prev, analysis];
//       }
//     });
//   };

//   const handleApplyFilter = () => {
//     // Implement filter logic here
//     console.log("Applying filters");
//     // For now, let's just increment the active filters count
//     setActiveFilters((prev) => prev + 1);
//   };

//   const currentAnalyses = showSeries
//     ? seriesAnalysesByTournament
//     : mapAnalysesByTournament;

//   return (
//     <main className="container py-8">
//       <ControlMenu
//         showSeries={showSeries}
//         setShowSeries={setShowSeries}
//         toggleSelectionMode={toggleSelectionMode}
//         selectionMode={selectionMode}
//         activeFilters={activeFilters}
//         handleApplyFilter={handleApplyFilter}
//       />
//       <TournamentList
//         currentAnalyses={currentAnalyses}
//         showSeries={showSeries}
//         expandedTournaments={expandedTournaments}
//         toggleExpanded={toggleExpanded}
//         selectionMode={selectionMode}
//         selectedAnalyses={selectedAnalyses}
//         toggleAnalysisSelection={toggleAnalysisSelection}
//       />
//       {selectionMode && (
//         <SelectionMenu
//           selectedAnalyses={selectedAnalyses}
//           showSeries={showSeries}
//         />
//       )}
//     </main>
//   );
// }
