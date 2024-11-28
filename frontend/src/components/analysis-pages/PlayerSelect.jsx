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
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getPlayerCleanName } from "@/data/general";
import { cn } from "@/lib/utils";
import { PlusCircle, X } from "lucide-react";

export default function PlayerSelect({ form, data }) {
  const availablePlayers = Object.keys(data.player_performance_data).map(
    (playerName) => ({
      clean: getPlayerCleanName(playerName),
      dirty: playerName,
    })
  );

  return (
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
                          const newValue = field.value?.includes(player.clean)
                            ? field.value.filter((p) => p !== player.clean)
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
  );
}
