import { z } from "zod";
import { requiredString } from "../requiredString";

export const BaseHolidayTitleSchema = z.object({
    title: requiredString('Kindly provide holiday title')
})

export type HolidayTitleType = z.infer<typeof BaseHolidayTitleSchema>

export const BaseHolidayPickSchema = z.object({
    branch_id: z.any(),
    value: z.string()
})

export type HolidayPickType = z.infer<typeof BaseHolidayPickSchema>

export const BaseHolidayStartEndSchema = z.object({
    selection: z.object({
        startDate: z.date(),
        endDate: z.date(),
        key: z.string().optional()
    }),
    affectedSchedules: z.any().optional()
})

export type HolidayStartEndType = z.infer<typeof BaseHolidayStartEndSchema>