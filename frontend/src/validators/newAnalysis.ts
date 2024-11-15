import { z } from "zod";

const basePlayerStats = z.object({
  kd: z.string(),
  assists: z.string(),
  non_traded_kills: z.string(),
});

const hardpointPlayerStats = basePlayerStats.extend({
  highest_streak: z.string(),
  damage: z.string(),
  hill_time: z.string(),
  avg_hill_time: z.string(),
  obj_kills: z.string(),
  contested_time: z.string(),
  kills_per_hill: z.string(),
  dmg_per_hill: z.string(),
});

const sndPlayerStats = basePlayerStats.extend({
  bombs_planted: z.string(),
  bombs_defused: z.string(),
  first_bloods: z.string(),
  first_deaths: z.string(),
  kills_per_round: z.string(),
  dmg_per_round: z.string(),
});

const controlPlayerStats = basePlayerStats.extend({
  tiers_captured: z.string(),
  obj_kills: z.string(),
  offense_kills: z.string(),
  defense_kills: z.string(),
  kills_per_round: z.string(),
  dmg_per_round: z.string(),
});

const playerStatsSchema = z.record(
  z.string(),
  z.union([hardpointPlayerStats, sndPlayerStats, controlPlayerStats])
);

export const analysisSchema = z.object({
  game_mode: z.string().min(1, "Please specify the game mode."),
  map: z.string().min(1, "Don't forget to mention the map!"),
  team_one: z.string().min(1, "Team one name is required."),
  team_one_score: z
    .number()
    .min(0, "Team one score must be a non-negative number."),
  team_two: z.string().min(1, "Team two name is required."),
  team_two_score: z
    .number()
    .min(0, "Team two score must be a non-negative number."),
  played_date: z.date({
    required_error: "When did this happen? We need a date! 📅",
    invalid_type_error:
      "Oops! This doesn't look like a valid date. Could you double-check it for me? 🤔",
  }),
  title: z
    .string()
    .min(1, "Don't be shy! Your analysis needs a title. 🏷️")
    .max(
      255,
      "Love the creativity, but can we keep the title under 255 characters? 📏"
    ),
  tournament: z
    .string()
    .min(1, "Ayo bud, what tournament was this in??")
    .max(
      255,
      "I think you're getting a bit too excited, keep the character count down."
    ),
  scoreboard_file_name: z.string().min(1, "Scoreboard file name is required."),
  player_stats: playerStatsSchema,
});

export type AnalysisFormData = z.infer<typeof analysisSchema>;
