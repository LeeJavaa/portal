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

export default function FilterSheet({ activeFilters = 0, onApplyFilter }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          {activeFilters ? `Filter (${activeFilters})` : "Filter"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Analyses</SheetTitle>
          <SheetDescription>
            Specify what you want to filter analyses on below. You can filter on
            a single field, or a combination of many fields.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-y-6 mt-4 mb-6">
          <div className="flex flex-col gap-y-3 mt-4">
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
          <div className="w-full flex items-center justify-center">
            <Button onClick={onApplyFilter}>Apply Filter(s)</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
