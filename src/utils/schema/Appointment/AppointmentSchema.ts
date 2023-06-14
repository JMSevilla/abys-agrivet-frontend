import { z } from "zod";
import { requiredString } from "../requiredString";

// const phoneNumberRegex = /^(\+?63|0)9\d{9}$/;

export const APBaseSchema = z.object({
    fullname: requiredString('Your full name is required.'),
    email: requiredString('Your email is required.').email(),
    phoneNumber: requiredString('Your phone number is required.')
})

export const APServicesSchema = z.object({
    branch_id: z.any(),
    service_id : z.any()
})

export const APPetInformationBaseSchema = z.object({
    petInfo: z.object({
        petType: requiredString('Kindly select pet'),
        petName: requiredString('Please provide pet name'),
        vetName: z.string().optional(),
        otherConcerns: z.string().optional(),
    }).array()
})


export const APSchedulingSchema = z.object({
    appointmentSchedule: z.object({
        id: z.number(),
        title: requiredString('Title of appointment required.'),
        start: z.date(),
        end: z.date(),
        isHoliday: z.boolean().optional()
    }).array()
})

export type AppointmentSchedulingType = z.infer<typeof APSchedulingSchema>
export type AppointmentPetInformationType = z.infer<typeof APPetInformationBaseSchema>
export type AppointmentServiceType = z.infer<typeof APServicesSchema>
export type AppointmentType = z.infer<typeof APBaseSchema>