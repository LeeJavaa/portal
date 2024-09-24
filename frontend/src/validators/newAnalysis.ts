import { z } from "zod";

export const analysisSchema = z.object({
  played_date: z.date({
    required_error: "When did this happen? We need a date! 📅",
    invalid_type_error:
      "Oops! This doesn't look like a valid date. Could you double-check it for me? 🤔",
  }),
  input_file: z
    .string()
    .min(1, "We need to analyse something!")
    .max(
      255,
      "Whoa there! That filename is a bit long. Can we keep it under 255 characters? 📁"
    ),
  title: z
    .string()
    .min(1, "Don't be shy! Your analysis needs a title. 🏷️")
    .max(
      255,
      "Love the creativity, but can we keep the title under 255 characters? 📏"
    ),
  map: z
    .string()
    .min(1, "Hmm, we seem to be lost. Which map are we analyzing? 🗺️"),
  game_mode: z
    .string()
    .min(1, "What's the game mode? Don't leave me hanging! 🎮")
    .max(
      255,
      "That's quite a game mode name! Let's keep it under 255 characters, shall we? 🕹️"
    ),
  start_time: z.string().refine(
    (val) => {
      const parsed = parseFloat(val);
      return !isNaN(parsed) && String(parsed) === val;
    },
    {
      message:
        "Oops! Start time should be a valid number. No sneaky letters or extra characters, please! ⏱️",
    }
  ),
  team_one: z
    .string()
    .min(1, "Team one is missing! Who are we cheering for? 👥"),
  team_two: z.string().min(1, "We need an opponent! Who's team two? 🏆"),
});

export type AnalysisFormData = z.infer<typeof analysisSchema>;
