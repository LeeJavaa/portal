import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTeamCode } from "@/data/general";

export default function TeamSelect({ form, data }) {
  const availableTeams = [
    { code: getTeamCode(data.team_one.toLowerCase()), name: data.team_one },
    { code: getTeamCode(data.team_two.toLowerCase()), name: data.team_two },
  ];

  return (
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
  );
}
