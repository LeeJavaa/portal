import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { GAME_MODES, MAPS, PLAYERS, TEAMS, TOURNAMENTS } from "@/data/general";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { analysisFiltersSchema } from "@/validators/analysisFilters";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";

export default function FilterSheet({ activeFilters = 0, onApplyFilter }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(analysisFiltersSchema),
    defaultValues: {
      tournament: searchParams.get("tournament") || "",
      game_mode: searchParams.get("game_mode") || "",
      map: searchParams.get("map") || "",
      team_one: searchParams.get("team_one") || "",
      team_two: searchParams.get("team_two") || "",
      player: searchParams.get("player") || "",
    },
  });

  const onSubmit = (values) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== "")
    );

    const params = new URLSearchParams(filteredValues);
    router.push(`/?${params.toString()}`);
    setOpen(false);

    const filtersCount = Object.keys(filteredValues).length;
    onApplyFilter(filtersCount);
  };

  const handleClearFilters = () => {
    form.reset({
      tournament: "",
      game_mode: "",
      map: "",
      team_one: "",
      team_two: "",
      player: "",
    });
    router.push("/");
    setOpen(false);
    onApplyFilter(0);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          {activeFilters ? `Filter (${activeFilters})` : "Filter"}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Analyses</SheetTitle>
          <SheetDescription>
            Specify what you want to filter analyses on below. You can filter on
            a single field, or a combination of many fields.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="tournament"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tournament" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TOURNAMENTS).map((tournament) => (
                        <SelectItem key={tournament.id} value={tournament.id}>
                          {tournament.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team_one"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TEAMS).map((team) => (
                        <SelectItem key={team.code} value={team.code}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team_two"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opponent</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an opponent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TEAMS).map((team) => (
                        <SelectItem key={team.code} value={team.code}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="map"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a map" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(MAPS).map((map) => (
                        <SelectItem key={map.code} value={map.code}>
                          {map.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="game_mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Mode</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gamemode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(GAME_MODES).map((mode) => (
                        <SelectItem key={mode.code} value={mode.code}>
                          {mode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="player"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player</FormLabel>
                  <Popover open={comboOpen} onOpenChange={setComboOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={comboOpen}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? Object.values(PLAYERS).find(
                                (player) => player.clean === field.value
                              )?.clean
                            : "Select player..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search player..." />
                        <CommandEmpty>No player found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {Object.values(PLAYERS).map((player) => (
                              <CommandItem
                                key={player.dirty}
                                value={player.clean}
                                onSelect={() => {
                                  form.setValue("player", player.clean);
                                  setComboOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === player.clean
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {player.clean}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <div className="w-full flex flex-col lg:flex-row justify-between gap-4 lg:gap-8 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex-1"
                >
                  Clear Filters
                </Button>
                <Button type="submit" className="flex-1">
                  Apply Filter(s)
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
