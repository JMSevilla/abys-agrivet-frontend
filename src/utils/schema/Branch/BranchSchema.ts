import { z } from "zod";
import { requiredString } from "../requiredString";

export const BaseBranchSchema = z.object({
  branch_id: z.number(),
  branchName: requiredString("Branch name is required."),
  branchKey: requiredString("Branch key is required."),
  branchPath: requiredString("Kindly select branch"),
});

export type BranchType = z.infer<typeof BaseBranchSchema>;

export const BaseModificationSchema = z.object({
  id: z.number().optional(),
  branchName: requiredString("Branch name is required.").optional(),
  branchKey: requiredString("Branch key is required.").optional(),
});

export type BranchModificationType = z.infer<typeof BaseModificationSchema>;
