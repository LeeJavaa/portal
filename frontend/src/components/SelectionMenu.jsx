import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSeriesAnalysis,
  createCustomAnalysisFromMaps,
  createCustomAnalysisFromSeries,
} from "@/api/newSeriesCustomAnalysisForm";
import SeriesCustomDialog from "./new-analysis-form/SeriesCustomDialog";
import { Button } from "@/components/ui/button";

export default function SelectionMenu({ showSeries, selectedAnalyses }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState(null);
  const selectedIds = selectedAnalyses.map((analysis) => analysis.id);

  const handleCreateAnalysis = async (data) => {
    try {
      let response;
      if (analysisType === "series") {
        response = await createSeriesAnalysis(selectedIds, data.title);
        await router.push(`/analysis/series/${response.id}`);
      } else {
        if (showSeries) {
          response = await createCustomAnalysisFromSeries(
            selectedIds,
            data.title
          );
        } else {
          response = await createCustomAnalysisFromMaps(
            selectedIds,
            data.title
          );
        }
        await router.push(`/analysis/custom/${response.id}`);
      }
      setDialogOpen(false);
    } catch (error) {
      return { error: error.message };
    }
  };

  const openDialog = (type) => {
    setAnalysisType(type);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border p-4 flex justify-between items-center">
        <div className="flex justify-between items-center w-full max-w-screen-2xl mx-auto">
          <div>({selectedAnalyses.length}) Selected</div>
          <div>
            <Button
              onClick={() => openDialog("series")}
              disabled={showSeries || selectedAnalyses.length < 3}
              className="mr-2"
            >
              Create Series Analysis
            </Button>
            <Button
              onClick={() => openDialog("custom")}
              disabled={selectedAnalyses.length < 1}
            >
              Create Custom Analysis
            </Button>
          </div>
        </div>
      </div>

      {dialogOpen && analysisType && (
        <SeriesCustomDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleCreateAnalysis}
          type={analysisType}
          selectedIds={selectedIds}
        />
      )}
    </>
  );
}
