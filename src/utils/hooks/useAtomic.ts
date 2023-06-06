import { atom } from "jotai";
import {
  AdministratorAccountType,
  LoginType,
} from "../schema/Account/AdminRegistrationSchema";
import { PlatformProps } from "@/pages/platform";
import {
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
