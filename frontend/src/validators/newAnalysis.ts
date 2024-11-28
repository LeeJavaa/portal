import { z } from "zod";

const playerStatsSchema = z.object({
  name: z.string(),
  kd: z.string(),
  assists: z.string(),
  non_traded_kills: z.string(),
  highest_streak: z.string(),
  damage: z.string(),
  mode_stat_one: z.string(),
  mode_stat_two: z.string(),
  mode_stat_three: z.string(),
  mode_stat_four: z.string(),
  mode_stat_five: z.string(),
  mode_stat_six: z.string(),
});

export const analysisSchema = z.object({
  game_mode: z.string().min(1, "Please specify the game mode."),
  map: z.string().min(1, "Don't forget to mention the map!"),
  team_one: z.string().min(1, "Team one name is required."),
  team_one_score: z
    .string()
    .min(1, "Team one score is required")
    .regex(/^\d+$/, "Score must contain only numbers")
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error("Invalid number");
      if (num < 0) throw new Error("Score cannot be negative");
      return val;
    })
    .refine((val) => parseInt(val, 10) <= 999, {
      message: "Score cannot exceed 999",
    }),
  team_two: z.string().min(1, "Team two name is required."),
  team_two_score: z
    .string()
    .min(1, "Team one score is required")
    .regex(/^\d+$/, "Score must contain only numbers")
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error("Invalid number");
      if (num < 0) throw new Error("Score cannot be negative");
      return val;
    })
    .refine((val) => parseInt(val, 10) <= 999, {
      message: "Score cannot exceed 999",
    }),
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
