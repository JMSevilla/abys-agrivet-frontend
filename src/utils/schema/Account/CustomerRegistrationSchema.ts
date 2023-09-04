import { z } from "zod";
import { requiredString } from "../requiredString";

export const customerBaseschema = z.object({
  firstname: requiredString("Your firstname is required."),
  lastname: requiredString("Your lastname is required."),
  username: requiredString("Your username is required."),
  branch: z.any().optional(),
  access_level: z.number().optional(),
  phoneNumber: requiredString("Your phone number is required."),
  email: requiredString("Your email is required").email(),
  password: requiredString("Your password is required").min(8),
  conpassword: requiredString("Kindly confirm your password").min(8),
});

export const customerSchema = z
  .discriminatedUnion("hasNoMiddleName", [
    z
      .object({
        hasNoMiddleName: z.literal(false),
        middlename: requiredString(
          "Please provide your middlename or select i do not have a middlename."
        ),
      })
      .merge(customerBaseschema),
    z
      .object({
        hasNoMiddleName: z.literal(true),
        middlename: z.string().optional(),
      })
      .merge(customerBaseschema),
  ])
  .refine(
    ({ conpassword, password }) => {
      return password === conpassword;
    },
    { path: ["conpassword"], message: "Password did not match" }
  )

export type CustomerAccountType = z.infer<typeof customerSchema>;

export const verificationBaseSchema = z.object({
  code: requiredString("Verification code is required."),
});

export type VerificationAccountType = z.infer<typeof verificationBaseSchema>;
