import { z } from "zod";
import { requiredString } from "../requiredString";

export const BaseHolidayTitleSchema = z.object({
    title: requiredString('Kindly provide holiday title')
})

export type HolidayTitleType = z.infer<typeof BaseHolidayTitleSchema>

export const BaseHolidayPickSchema = z.object({
    branch_id: z.number()
})

export type HolidayPickType = z.infer<typeof BaseHolidayPickSchema>