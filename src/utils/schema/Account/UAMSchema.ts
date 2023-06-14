import { z } from "zod";
import { requiredString } from "../requiredString";
import { zodResolver } from "@hookform/resolvers/zod";

export const BaseUAMSchema = z.object({
    firstname: requiredString('Your firstname is required'),
    lastname: requiredString('Your lastname is required.'),
    username: requiredString('Your username is required.'),
    branch: z.any().optional(),
    access_level: requiredString('Kindly select access level.'),
    phoneNumber: requiredString("Your phone number is required.")
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
    password: requiredString('Your password is required'),
    conpassword: requiredString('Kindly confirm your password')
}).refine(
    ({conpassword, password}) => {
        return password === conpassword
    },
    { path: ['conpassword'], message: 'Password not match'}
)

export type UAMAccountCredType = z.infer<typeof BaseUAMCredSchema>
