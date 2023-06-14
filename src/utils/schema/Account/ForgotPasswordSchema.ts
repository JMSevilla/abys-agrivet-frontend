import { z } from "zod";
import { requiredString } from "../requiredString";


export const baseFPSchema = z.object({
    email: requiredString('Your email is required.').email()
})

export type FPAccountType = z.infer<typeof baseFPSchema> 

export const baseCheckVerificationCode = z.object({
    code: requiredString("Verification code is required.")
})


export type baseVerificationType = z.infer<typeof baseCheckVerificationCode>

export const FPNewPasswordBaseSchema = z.object({
    password: requiredString('Your password is required.'),
    conpassword: requiredString('Kindly confirm your password')
}).refine(
    ({ conpassword, password }) => {
        return password === conpassword
    },
    {
        path: ['conpassword'],
        message: 'Password is not match'
    }
)

export type FPNewPasswordType = z.infer<typeof FPNewPasswordBaseSchema>