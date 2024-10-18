import { z } from "zod";

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
});

export type AnalysisFormData = z.infer<typeof analysisSchema>;
