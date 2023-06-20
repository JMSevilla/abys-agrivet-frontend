import { z } from "zod";
import { requiredString } from "../requiredString";

export const baseRecommendationsSchema = z.object({
    title: requiredString('Provide appointment title.'),
    customerName: requiredString('Customer name is required.'),
    branchName: requiredString('Provide branch name.'),
    service: z.any(),
    description: z.string(),
    start: z.date(),
    end: z.date(),
    value: z.string(),
    diagnosis: z.string(),
    treatment: z.string(),
    branch_id: z.number().optional()
})

export type RecommendationsType = z.infer<typeof baseRecommendationsSchema>