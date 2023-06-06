import { requiredString } from "../requiredString";
import { z } from "zod";

export const ServiceBaseSchema = z.object({
  serviceName: requiredString("Kindly provide service name"),
  serviceBranch: z
    .object({
      branchName: z.string(),
      branch_id: z.number(),
    })
    .array(),
});

export type ServiceCreation = z.infer<typeof ServiceBaseSchema>;
