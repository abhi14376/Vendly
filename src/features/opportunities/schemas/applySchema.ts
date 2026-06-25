import { z } from "zod";

export const applyOpportunitySchema = z.object({
  proposal: z
    .string()
    .min(50, "Proposal must be at least 50 characters long.")
    .max(2000, "Proposal cannot exceed 2000 characters."),
  estimatedTimeline: z.string().min(1, "Estimated timeline is required."),
  costEstimate: z.coerce.number().positive("Cost must be a positive number."),
});

export type ApplyOpportunityFormData = z.infer<typeof applyOpportunitySchema>;
