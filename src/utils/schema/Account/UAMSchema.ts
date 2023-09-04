import { z } from "zod";
import { requiredString } from "../requiredString";
import { zodResolver } from "@hookform/resolvers/zod";


export const profileSchema = z.object({
    firstname: requiredString('Your firstname is required'),
    lastname: requiredString('Your lastname is required.'),
    username: requiredString('Your username is required.'),
    phoneNumber: requiredString("Your phone number is required."),
    email: requiredString('Your email is required').email(),
    currentPassword: requiredString('Your current password is required.'),
    password: z.string().max(16).optional(),
    conpassword: z.string().max(16).optional(),
    profileImage: z.string().optional()
})

export const profileOnFrontSchema = z.discriminatedUnion('hasNoMiddleName', [
    z.object({
        hasNoMiddleName: z.literal(false),
        middlename: requiredString('Please provide your middlename or select i do not have a middlename')
    }).merge(profileSchema),
    z.object({
        hasNoMiddleName: z.literal(true),
        middlename: z.string().optional()
    }).merge(profileSchema)
]).refine(
    ({conpassword, password}) => {
        return password === conpassword
    },
    { path: ['conpassword'], message: 'Password not match'}
)

export type ProfileType = z.infer<typeof profileOnFrontSchema>

export const BaseUAMSchema = z.object({
    firstname: requiredString('Your firstname is required'),
    lastname: requiredString('Your lastname is required.'),
    username: requiredString('Your username is required.'),
    branch: z.any().optional(),
    access_level: requiredString('Kindly select access level.'),
    phoneNumber: requiredString("Your phone number is required."),
})

export const uam_schema = z.discriminatedUnion('hasNoMiddleName', [
    z.object({
        hasNoMiddleName: z.literal(false),
        middlename: requiredString('Please provide your middlename or select i do not have a middlename')
    }).merge(BaseUAMSchema),
    z.object({
        hasNoMiddleName: z.literal(true),
        middlename: z.string().optional()
    }).merge(BaseUAMSchema)
])

export type UAMAccountType = z.infer<typeof uam_schema>

export const BaseUAMCredSchema = z.object({
    email: requiredString('Your email is required').email(),
    password: requiredString('Your password is required').max(16),
    conpassword: requiredString('Kindly confirm your password').max(16)
}).refine(
    ({conpassword, password}) => {
        return password === conpassword
    },
    { path: ['conpassword'], message: 'Password not match'}
)

export type UAMAccountCredType = z.infer<typeof BaseUAMCredSchema>
