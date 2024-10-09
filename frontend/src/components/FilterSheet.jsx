import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterSheet({ activeFilters = 0, onApplyFilter }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-4 right-4 z-90"
        >
          Filter ({activeFilters})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Analyses</SheetTitle>
          <SheetDescription>
            Use this filter menu to filter between maps or series
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-y-2 mt-4">
            <Label htmlFor="tournament" className="text-left">
              Tournament
            </Label>
            <Input id="tournament" className="col-span-3" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="team" className="text-left">
              Team
            </Label>
            <Input id="team" className="col-span-3" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="opponent" className="text-left">
              Opponent
            </Label>
            <Input id="opponent" className="col-span-3" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="map" className="text-left">
              Map
            </Label>
            <Input id="map" className="col-span-3" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="gameMode" className="text-left">
              Game Mode
            </Label>
            <Input id="gameMode" className="col-span-3" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="player" className="text-left">
              Player
            </Label>
            <Input id="player" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={onApplyFilter}>Apply Filter</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}