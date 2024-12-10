import FilterSheet from "@/components/public-page/FilterSheet";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";

export default function ControlMenu({
  showSeries,
  setShowSeries,
  selectionMode,
  toggleSelectionMode,
  activeFilters,
  handleApplyFilter,
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Toggle
          onClick={toggleSelectionMode}
          variant={selectionMode ? "secondary" : "outline"}
          aria-label="Toggle selection mode to select different analyses"
        >
          <span className="hidden lg:inline">
            {selectionMode ? "Cancel Selection" : "Select Analyses"}
          </span>
          <span className="lg:hidden">
            {selectionMode ? "Cancel" : "Select"}
          </span>
        </Toggle>
        <div className="flex items-center space-x-2 lg:mr-28">
          <span>Maps</span>
          <Switch
            checked={showSeries}
            onCheckedChange={setShowSeries}
            aria-label="Toggle between map and series analyses"
          />
          <span>Series</span>
        </div>
        <FilterSheet
          activeFilters={activeFilters}
          onApplyFilter={handleApplyFilter}
        />
      </div>
    </>
  );
}
