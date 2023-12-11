import React, { useState, useEffect, useContext } from "react";
import { useToastContext } from "@/utils/context/Toast/ToastContext";

import {
  ControlledGrid,
  ControlledBackdrop,
  UncontrolledCard,
  ControlledContainer,
  ControlledCheckbox,
  ControlledSelectField,
  NormalButton,
} from "@/components";
import { Grid, Typography } from "@mui/material";
import { ControlledTextField } from "@/components";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter/PasswordStrengthMeter";
import { useQuery, useMutation } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import { adminBaseSchema } from "@/utils/schema/Account/AdminRegistrationSchema";
import { schema } from "@/utils/schema/Account/AdminRegistrationSchema";
import { AdministratorAccountType } from "@/utils/schema/Account/AdminRegistrationSchema";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { AdministratorAccountCreationAtom } from "@/utils/hooks/useAtomic";
import { useAtom, useSetAtom } from "jotai";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountSetup, JWTAccountCreationProps } from "@/utils/types";
import { useSetupContext } from "@/utils/context/SetupContext/SetupContext";
import { useRouter } from "next/router";
import { ControlledMobileNumberField } from "@/components/TextField/MobileNumberField";
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
};
zxcvbnOptions.setOptions(options);

const AdministratorAccountSetupForm = () => {
  const { control, watch, resetField, trigger, getValues, setError } =
    useFormContext<AdministratorAccountType>();
  const hasNoMiddleName = watch("hasNoMiddleName");
  const hasNoMiddleNamePreviousValue = usePreviousValue(hasNoMiddleName);
  const mobileNumber = watch("phoneNumber");
  const phoneNumberRegex = /^(\+?63|0)9\d{9}$/;
  useEffect(() => {
    resetField("middlename");
    if (hasNoMiddleNamePreviousValue) {
      trigger("middlename");
    }
  }, [hasNoMiddleName, hasNoMiddleNamePreviousValue, resetField, trigger]);
  const passwordHasValue = watch("password");
  useEffect(() => {}, [passwordHasValue]);
  useEffect(() => {
    const values = getValues();
    if (phoneNumberRegex.test(values.phoneNumber)) {
      return;
    } else {
      setError("phoneNumber", { message: "Invalid phone number" });
    }
  }, [mobileNumber]);
  const result = zxcvbn(
    getValues().password == undefined ? "" : getValues().password
  );
  return (
    <>
      <ControlledGrid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            name="firstname"
            label="Firstname"
            required
            shouldUnregister
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            disabled={hasNoMiddleName}
            name="middlename"
            required={!hasNoMiddleName}
            label="Middlename"
            shouldUnregister
          />
          <ControlledCheckbox
            control={control}
            name="hasNoMiddleName"
            label="I do not have a middle name"
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            name="lastname"
            label="lastname"
            required
            shouldUnregister
          />
        </Grid>
      </ControlledGrid>
      <ControlledGrid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            name="email"
            label="Email"
            required
            shouldUnregister
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledMobileNumberField
            control={control}
            name="phoneNumber"
            required
            shouldUnregister
            label="Mobile Number"
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            name="username"
            label="Username"
            required
            shouldUnregister
          />
        </Grid>
      </ControlledGrid>
      <ControlledGrid>
        <Grid item xs={6}>
          <ControlledTextField
            control={control}
            name="password"
            label="Password"
            required
            type="password"
            shouldUnregister
          />
          <PasswordStrengthMeter
            result={result}
            password={getValues().password}
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledTextField
            control={control}
            name="conpassword"
            label="Confirm Password"
            required
            type="password"
            shouldUnregister
          />
        </Grid>
      </ControlledGrid>
    </>
  );
};

export const AdministratorAccountSetupFormAdditional = () => {
  const [adminAtom, setAdminAtom] = useAtom(AdministratorAccountCreationAtom);
  const [open, setOpen] = useState(false);
  const AccountCreationApplicationSetup = useApiCallBack(
    async (api, args: AccountSetup) => {
      const result = await api.users.SetupAccountRegistration(args);
      return result;
    }
  );
  const { setupCheckUsersDB } = useSetupContext();
  const { handleOnToast } = useToastContext();
  const JWTAccountSetupCreationAccount = useApiCallBack(
    async (api, args: JWTAccountCreationProps) =>
      await api.authentication.JWTAccountCreation(args)
  );
  const form = useForm<AdministratorAccountType>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: adminAtom ?? { hasNoMiddleName: false },
  });
  const useApplicationRegistration = () => {
    return useMutation((args: AccountSetup) =>
      AccountCreationApplicationSetup.execute(args)
    );
  };
  const useJwtAccountCreationSetup = useMutation(
    (props: JWTAccountCreationProps) =>
      JWTAccountSetupCreationAccount.execute(props)
  );
  const {
    formState: { isValid },
    handleSubmit,
    getValues,
    setError,
  } = form;
  const router = useRouter();

  useEffect(() => {
    setupCheckUsersDB({ location: "admin-account-setup" });
  }, []);
  const { mutate } = useApplicationRegistration();
  const handleContinue = () => {
    handleSubmit((values) => {
      setOpen(!open);
      const obj = {
        firstname: values.firstname,
        middlename: adminAtom?.hasNoMiddleName ? "N/A" : values.middlename,
        lastname: values.lastname,
        email: values.email,
        username: values.username,
        password: values.password,
        phoneNumber: "+63" + values.phoneNumber,
        branch: 6,
      };
      setAdminAtom(values);
      mutate(obj, {
        onSuccess: (response: any) => {
          const { data }: any = response;
          if (data == 200) {
            const jwts = {
              jwtusername: values.email,
              jwtpassword: values.password,
            };
            useJwtAccountCreationSetup.mutate(jwts, {
              onSuccess: (repo: any) => {
                if (repo?.data?.status == "Success") {
                  setOpen(false);
                  handleOnToast(
                    "Successfully Created an Account",
                    "top-right",
                    false,
                    true,
                    true,
                    true,
                    undefined,
                    "dark",
                    "success"
                  );
                  router.push("/");
                }
              },
            });
          }
        },
      });
    })();
  };
  return (
    <FormProvider {...form}>
      <UncontrolledCard>
        <Typography variant="overline">Administrator Account Setup</Typography>
        <hr />
        <AdministratorAccountSetupForm />
        <NormalButton
          sx={{
            float: "right",
            mt: 2,
            mb: 2,
          }}
          variant="outlined"
          size="small"
          onClick={handleContinue}
          disabled={!isValid}
        >
          CREATE
        </NormalButton>
      </UncontrolledCard>
      <ControlledBackdrop open={open} />
    </FormProvider>
  );
};
