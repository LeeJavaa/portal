import { Button } from "@/components/ui/button";

export default function SelectionMenu({ showSeries, selectedAnalyses }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border p-4 flex justify-between items-center">
      <div className="flex justify-between items-center w-full max-w-screen-2xl mx-auto">
        <div>({selectedAnalyses.length}) Selected</div>
        <div>
          <Button
            onClick={() => {
              /* Handle create series analysis */
            }}
            disabled={showSeries || selectedAnalyses.length < 1}
            className="mr-2"
          >
            Create Series Analysis
          </Button>
          <Button
            onClick={() => {
              /* Handle create custom analysis */
            }}
            disabled={selectedAnalyses.length < 1}
          >
            Create Custom Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
