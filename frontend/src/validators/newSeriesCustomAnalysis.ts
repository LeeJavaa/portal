import { z } from "zod";

export const newSeriesCustomAnalysisSchema = z.object({
  title: z
    .string()
    .min(3, "Sheesh, give us something to work with... 📏")
    .max(255, "Whoa there! Let's keep the title under 255 characters. 🎯"),
  ids: z
    .array(z.number().int())
    .min(2, "You need to select at least 2 analyses to combine! 🔄"),
});

export type NewAnalysisFormData = z.infer<typeof newSeriesCustomAnalysisSchema>;
