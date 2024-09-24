import { z } from "zod";

export const analysisSchema = z.object({
  played_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message:
      "Oops! This date seems a bit wonky. Could you double-check it for me? 📅",
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
  start_time: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message:
      "Start time should be a number. Did you accidentally type letters instead of numbers? ⏱️",
  }),
  team_one: z
    .string()
    .min(1, "Team one is missing! Who are we cheering for? 👥"),
  team_two: z.string().min(1, "We need an opponent! Who's team two? 🏆"),
});

export type AnalysisFormData = z.infer<typeof analysisSchema>;
