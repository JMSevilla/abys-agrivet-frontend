import { z } from "zod";
import { requiredString } from "../requiredString";

export const WalkedInBaseSchema = z.object({
    email: requiredString("Your email is required.").email(),
    phoneNumber: requiredString('Your phone number is required.'),
    firstname: requiredString('Your firstname is required.'),
    lastname: requiredString('Your lastname is required.'),
    branchName: z.string().optional(),
    branch_id: z.number().optional(),
    service_id: z.any(),
    petInfo: z.object({
        petType: requiredString('Kindly select pet'),
        petName: requiredString('Please provide pet name'),
        breed: requiredString('Please provide breed.'),
        gender: requiredString('Please provide gender.'),
        birthdate: z.any(),
        vetName: z.string().optional(),
        otherConcerns: z.string().optional(),
    }).array(),
    appointmentSchedule: z.object({
        id: z.number(),
        title: requiredString('Title of appointment required.'),
        start: z.date(),
        end: z.date(),
        isHoliday: z.boolean().optional()
    }).array(),
    start: z.date(),
    end: z.date()
})

export const WalkedInSchema = z.discriminatedUnion('hasNoMiddleName', [
    z.object({
        hasNoMiddleName: z.literal(false),
        middlename: requiredString('Please provide your middlename or select i do not have a middlename.')
    }).merge(WalkedInBaseSchema),
    z.object({
        hasNoMiddleName: z.literal(true),
        middlename: z.string().optional()
    }).merge(WalkedInBaseSchema)
])

export type WalkedInType = z.infer<typeof WalkedInSchema>