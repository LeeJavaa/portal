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
import { ArrowRight } from "lucide-react";

export default function GameDataDisplay({ form, setFormStep }) {
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
              <Select onValueChange={field.onChange} defaultValue="HP">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gamemode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HP">Hardpoint</SelectItem>
                  <SelectItem value="SND">Search and Destroy</SelectItem>
                  <SelectItem value="CNTRL">Control</SelectItem>
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
              <Select onValueChange={field.onChange} defaultValue="karachi">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a map" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="highrise">Highrise</SelectItem>
                  <SelectItem value="invasion">Invasion</SelectItem>
                  <SelectItem value="karachi">Karachi</SelectItem>
                  <SelectItem value="rio">Rio</SelectItem>
                  <SelectItem value="sixstar">Six Star</SelectItem>
                  <SelectItem value="subbase">Sub Base</SelectItem>
                  <SelectItem value="vista">Vista</SelectItem>
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
              <Select onValueChange={field.onChange} defaultValue="OT">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team two" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AF">Atlanta FaZe</SelectItem>
                  <SelectItem value="OT">OpTic Texas</SelectItem>
                  <SelectItem value="NYSL">New York Subliners</SelectItem>
                  <SelectItem value="TU">Toronto Ultra</SelectItem>
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
                  placeholder="Enter the score for team one"
                  defaultValue={250}
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
              <Select onValueChange={field.onChange} defaultValue="NYSL">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team one" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AF">Atlanta FaZe</SelectItem>
                  <SelectItem value="OT">OpTic Texas</SelectItem>
                  <SelectItem value="NYSL">New York Subliners</SelectItem>
                  <SelectItem value="TU">Toronto Ultra</SelectItem>
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
                  placeholder="Enter the score for team two"
                  defaultValue={210}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="w-full flex gap-2">
        <Button type="button" variant={"ghost"} onClick={() => setFormStep(3)}>
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
