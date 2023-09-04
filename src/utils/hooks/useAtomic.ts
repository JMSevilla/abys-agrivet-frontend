import { atom } from "jotai";
import {
  AdministratorAccountType,
  LoginType,
} from "../schema/Account/AdminRegistrationSchema";
import { PlatformProps } from "@/pages/platform";
import {
  ProfileType,
  UAMAccountCredType,
  UAMAccountType,
} from "../schema/Account/UAMSchema";
import {
  CustomerAccountType,
  VerificationAccountType,
} from "../schema/Account/CustomerRegistrationSchema";
import {
  BranchModificationType,
  BranchType,
} from "../schema/Branch/BranchSchema";
import { ServiceCreation } from "../schema/Services/ServiceSchema";
import { AppointmentPetInformationType, AppointmentSchedulingType, AppointmentServiceType, AppointmentType } from "../schema/Appointment/AppointmentSchema";
import { FPAccountType, FPNewPasswordType, baseFPPhone, baseVerificationType } from "../schema/Account/ForgotPasswordSchema";
import { HolidayPickType, HolidayStartEndType, HolidayTitleType } from "../schema/Appointment/HolidaySchema";
import { RecommendationsType } from "../schema/Appointment/RecommendationsAppointment";
import { WalkedInType } from "../schema/Appointment/WalkedInAppointmentSchema";
export const AdministratorAccountCreationAtom = atom<
  AdministratorAccountType | undefined
>(undefined);
export const PlatformAtom = atom<PlatformProps | undefined>(undefined);
export const LoginAccountAtom = atom<LoginType | undefined>(undefined);

export type AuthenticationAtomProps = {
  AccessToken: string | undefined;
  RefreshToken: string | undefined;
  BranchPath: string | undefined;
};

export const AuthenticationAtom = atom<AuthenticationAtomProps | undefined>(
  undefined
);

export const UAMAccountCreationAtom = atom<UAMAccountType | undefined>(
  undefined
);

export const UAMAccountCredentialsAtom = atom<UAMAccountCredType | undefined>(
  undefined
);

export const CustomerAccountCreationAtom = atom<
  CustomerAccountType | undefined
>(undefined);

export const VerificationAccountAtom = atom<
  VerificationAccountType | undefined
>(undefined);

export const BranchAtom = atom<BranchType | undefined>(undefined);

export const BranchModificationAtom = atom<BranchModificationType | undefined>(
  undefined
);

export const ServiceAtom = atom<ServiceCreation | undefined>(undefined);

export const AppointmentAtom = atom<AppointmentType | undefined>(undefined)

export const AppointmentServicesAtom = atom<AppointmentServiceType | undefined>(undefined)

export const AppointmentPetInformationAtom = atom<AppointmentPetInformationType | undefined>(undefined)

export const AppointmentSchedulingAtom = atom<AppointmentSchedulingType | undefined>(undefined)

export const FPAtom = atom<FPAccountType | undefined>(undefined)

export const FPVerificationCode = atom<baseVerificationType | undefined>(undefined)

export const FPNewPasswordAtom = atom<FPNewPasswordType | undefined>(undefined)

export const HolidayTitleAtom = atom<HolidayTitleType | undefined>(undefined)

export const HolidayPickAtom = atom<HolidayPickType | undefined>(undefined)

export const HolidayStartEndAtom = atom<HolidayStartEndType | undefined>(undefined)

export const RecommendationsAtom = atom<RecommendationsType | undefined>(undefined)

export const WalkedInAtom = atom<WalkedInType | undefined>(undefined)

export const FPPhoneAtom = atom<baseFPPhone | undefined>(undefined)

export const ProfileAtom = atom<ProfileType | undefined>(undefined)