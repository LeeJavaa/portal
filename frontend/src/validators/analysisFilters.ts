import { z } from "zod";

export const analysisFiltersSchema = z.object({
  tournament: z.string().optional(),
  game_mode: z.string().optional(),
  map: z.string().optional(),
  team_one: z.string().optional(),
  team_two: z.string().optional(),
  player: z.string().optional(),
  players: z.array(z.string()).optional(),
  team: z.string().optional(),
});

export type AnalysisFiltersForm = z.infer<typeof analysisFiltersSchema>;
