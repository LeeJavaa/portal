"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { deleteMapAnalysis } from "@/api/analysis";
import { zodResolver } from "@hookform/resolvers/zod";
import { analysisFiltersSchema } from "@/validators/analysisFilters";
import { getPlayerCleanName, getTeamCode } from "@/data/general";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CircleAlert,
  ChartNoAxesColumnIncreasing,
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function FilterBar({ data, scoreboardUrl }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const availableTeams = [
    { code: getTeamCode(data.team_one.toLowerCase()), name: data.team_one },
    { code: getTeamCode(data.team_two.toLowerCase()), name: data.team_two },
  ];

  const availablePlayers = Object.keys(data.player_performance_data).map(
    (playerName) => ({
      clean: getPlayerCleanName(playerName),
      dirty: playerName,
    })
  );

  const urlPlayers = searchParams.get("players")?.split(",") || [];

  const form = useForm({
    resolver: zodResolver(analysisFiltersSchema),
    defaultValues: {
      team: searchParams.get("team") || "",
      players: urlPlayers,
    },
  });

  const activeFilters = ["team", "players"].reduce(
    (count, param) => (searchParams.get(param) ? count + 1 : count),
    0
  );

  const onSubmit = (values) => {
    const filteredValues = {
      ...Object.fromEntries(
        Object.entries(values).filter(([_, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value !== "";
        })
      ),
    };

    if (filteredValues.players) {
      filteredValues.players = filteredValues.players.join(",");
    }

    const params = new URLSearchParams(filteredValues);
    router.push(`/analysis/map/${data.id}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    form.reset({
      team: "",
      players: [],
    });
    router.push(`/analysis/map/${data.id}`);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteMapAnalysis(data.id);
      setIsDeleteDialogOpen(false);
      router.push("/");
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-between mt-8">
      <div className="flex gap-x-2 items-center">
        <ChartNoAxesColumnIncreasing className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Visualise the Data</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-x-5">
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Team" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.code} value={team.code}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="players"
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[280px] justify-between",
                          !field.value?.length && "text-muted-foreground"
                        )}
                      >
                        {field.value?.length > 0 ? (
                          <div className="flex gap-1 flex-wrap">
                            {field.value.map((player) => (
                              <Badge
                                variant="secondary"
                                key={player}
                                className="mr-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newValue = field.value.filter(
                                    (p) => p !== player
                                  );
                                  form.setValue("players", newValue);
                                }}
                              >
                                {player}
                                <X className="w-3 h-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          "Select players..."
                        )}
                        <PlusCircle className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0">
                    <Command>
                      <CommandInput placeholder="Search players..." />
                      <CommandEmpty>No player found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {availablePlayers.map((player) => (
                            <CommandItem
                              key={player.clean}
                              onSelect={() => {
                                const newValue = field.value?.includes(
                                  player.clean
                                )
                                  ? field.value.filter(
                                      (p) => p !== player.clean
                                    )
                                  : [...(field.value || []), player.clean];
                                form.setValue("players", newValue);
                              }}
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  field.value?.includes(player.clean)
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}
                              >
                                <X className="h-3 w-3" />
                              </div>
                              {player.dirty}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <div className="flex gap-x-2">
            {activeFilters > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
            <Button type="submit">
              {activeFilters > 0 ? `Filter (${activeFilters})` : "Apply Filter"}
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex gap-x-5">
        {data.screenshot && (
          <Dialog>
            <DialogTrigger className="hover:underline">
              View Original
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Original Scoreboard Screenshot</DialogTitle>
                <DialogDescription>For your viewing pleasure</DialogDescription>
              </DialogHeader>
              <div className="relative w-full aspect-video">
                {scoreboardUrl ? (
                  <>
                    <Image
                      src={scoreboardUrl}
                      alt="Original Scoreboard"
                      className="rounded-lg object-contain"
                      fill
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                      unoptimized
                    />
                    <ImageIcon
                      className="w-32 h-32 mx-auto hidden"
                      aria-label="Image failed to load"
                    />
                  </>
                ) : (
                  <ImageIcon className="w-32 h-32 mx-auto" />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            // Clear error when dialog is closed
            if (!open) setDeleteError(null);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline">
              <Trash2 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this analysis?
              </DialogTitle>
              <DialogDescription>
                Deleting this analysis means you will need to recreate it in
                order to see this data again.
              </DialogDescription>
            </DialogHeader>
            <CircleAlert className="w-32 h-32 mx-auto" />
            {deleteError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to delete analysis: {deleteError}
                </AlertDescription>
              </Alert>
            )}
            <DialogFooter className="flex gap-x-2 justify-center">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
