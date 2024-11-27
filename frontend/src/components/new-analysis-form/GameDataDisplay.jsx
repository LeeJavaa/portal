import { useEffect } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  GAME_MODES,
  MAPS,
  TEAMS,
  getGameMode,
  getMapName,
  getTeamCode,
} from "@/data/general";
import { ArrowRight } from "lucide-react";

export default function GameDataDisplay({ form, setFormStep, data }) {
  const handleNextStep = async () => {
    const isValid = await form.trigger([
      "game_mode",
      "map",
      "team_one",
      "team_one_score",
      "team_two",
      "team_two_score",
    ]);
    if (isValid) {
      setFormStep(3);
    }
  };

  useEffect(() => {
    const currentFormValues = form.getValues();
    const isFormEmpty = !currentFormValues.game_mode;
    if (data?.metadata && isFormEmpty) {
      form.reset({
        game_mode: getGameMode(data.metadata.game_mode[0]),
        map: getMapName(data.metadata.map_name[0]),
        team_one: getTeamCode(data.metadata.team_one_name[0]),
        team_one_score: data.metadata.team_one_score[0],
        team_two: getTeamCode(data.metadata.team_two_name[0]),
        team_two_score: data.metadata.team_two_score[0],
      });
    }
  }, [data]);

  if (!data?.metadata) {
    return (
      <Alert variant="destructive" className="w-full border-2 mb-2">
        <AlertDescription className="font-medium">
          Something went wrong while processing. Please restart.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="space-y-5 pb-5">
        {/* Game Mode */}
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
        {/* Map */}
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
        {/* Team One */}
        <FormField
          control={form.control}
          name="team_one"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team One</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team one" />
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
        {/* Team One Score */}
        <FormField
          control={form.control}
          name="team_one_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team One Score</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  placeholder="Enter score for team 1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Team Two */}
        <FormField
          control={form.control}
          name="team_two"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Two</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team two" />
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
        {/* Team Two Score */}
        <FormField
          control={form.control}
          name="team_two_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Two Score</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  placeholder="Enter score for team 2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="w-full flex gap-2">
        <Button type="button" variant={"ghost"} onClick={handleNextStep}>
          Next step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button type="button" variant={"ghost"} onClick={() => setFormStep(0)}>
          Go back
        </Button>
      </div>
    </>
  );
}
