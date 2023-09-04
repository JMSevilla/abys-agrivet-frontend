import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "../requiredString";

export const adminBaseSchema = z.object({
    firstname: requiredString('Your firstname is required'),
    lastname: requiredString('Your lastname is required'),
    email: requiredString('Your email is required').email(),
    username: requiredString('Your username is required.'),
    phoneNumber: requiredString("Your phone number is required."),
    password: requiredString('Your password is required').max(16),
    conpassword: requiredString('Please confirm your password').max(16),
    branch: z.string().optional()
})

export const schema = z.discriminatedUnion('hasNoMiddleName', [
    z.object({
        hasNoMiddleName: z.literal(false),
        middlename: requiredString('Please provide your middlename or select i do not have a middlename')
    }).merge(adminBaseSchema),
    z.object({
        hasNoMiddleName : z.literal(true),
        middlename: z.string().optional(),
    }).merge(adminBaseSchema)
]).refine(
    ({ conpassword, password }) => {
      return password === conpassword;
    },
    { path: ["conpassword"], message: "Password did not match" }
  ).refine((data) => {
    const hasSpecialCharacter = /[!@#$%^&*()_+]/.test(data.password);
    const hasUpperCase = /[A-Z]/.test(data.password);
    return hasSpecialCharacter && hasUpperCase;
  }, { path: ['password'], message : 'Password must contain at least one special character and one upper case letter'})

export type AdministratorAccountType = z.infer<typeof schema>

export const baseLoginSchema = z.object({
    email : requiredString('Your email is required.').email(),
    password: requiredString('Your password is required.'),
    branch: z.any().optional()
})
export type LoginType = z.infer<typeof baseLoginSchema>