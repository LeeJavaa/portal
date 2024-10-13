import { z } from "zod";

export const analysisSchema = z.object({
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
