import FilterSheet from "@/components/FilterSheet";
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
    <div className="flex justify-between mb-4">
      <div className="flex items-center justify-start mb-4 gap-x-6">
        <Toggle
          onClick={toggleSelectionMode}
          variant={selectionMode ? "secondary" : "outline"}
        >
          {selectionMode ? "Cancel Selection" : "Select Analyses"}
        </Toggle>
        <div className="flex items-center space-x-2">
          <span>Maps</span>
          <Switch checked={showSeries} onCheckedChange={setShowSeries} />
          <span>Series</span>
        </div>
      </div>
      <FilterSheet
        activeFilters={activeFilters}
        onApplyFilter={handleApplyFilter}
      />
    </div>
  );
}
