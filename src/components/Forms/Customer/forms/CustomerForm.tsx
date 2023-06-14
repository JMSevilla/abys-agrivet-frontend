import React, { useState, useEffect } from "react";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import {
  ControlledGrid,
  ControlledBackdrop,
  UncontrolledCard,
  ControlledCheckbox,
  NormalButton,
} from "@/components";
import { Grid, Typography } from "@mui/material";
import { ControlledTextField } from "@/components";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter/PasswordStrengthMeter";
import { useMutation } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { ControlledMobileNumberField } from "@/components/TextField/MobileNumberField";
import { CustomerAccountType } from "@/utils/schema/Account/CustomerRegistrationSchema";
import {
  customerSchema,
  customerBaseschema,
} from "@/utils/schema/Account/CustomerRegistrationSchema";
import { CustomerAccountCreationAtom } from "@/utils/hooks/useAtomic";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountSetup } from "@/utils/types";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { MAX_CUSTOMER_STEPS } from "..";

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
};
zxcvbnOptions.setOptions(options);

const CustomerAccountForm = () => {
  const { control, watch, trigger, resetField, getValues, setError } =
    useFormContext<CustomerAccountType>();
  const hasNoMiddleName = watch("hasNoMiddleName");
  const hasNoMiddleNamePreviousValue = usePreviousValue(hasNoMiddleName);
  const mobileNumber = watch("phoneNumber");
  const phoneNumberRegex = /^(\+?63|0)9\d{9}$/;
  const passwordValue = watch("password");
  useEffect(() => {
    resetField("middlename");
    if (hasNoMiddleNamePreviousValue) {
      trigger("middlename");
    }
  }, [hasNoMiddleName, hasNoMiddleNamePreviousValue, trigger, resetField]);
  useEffect(() => {}, [passwordValue]);
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
            required
            shouldUnregister
            label="Firstname"
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
          <PasswordStrengthMeter result={result} password={getValues().password} />
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

export const CustomerAccountFormAdditional = () => {
  const [customerDetails, setCustomerDetails] = useAtom(
    CustomerAccountCreationAtom
  );
  const [open, setOpen] = useState(false);
  const { handleOnToast } = useToastContext();
  const customerAccountCreationRequest = useApiCallBack(
    async (api, args: AccountSetup) => {
      var result = await api.users.CustomerAccountRegistration(args);
      return result;
    }
  );
  const form = useForm<CustomerAccountType>({
    mode: "all",
    resolver: zodResolver(customerSchema),
    defaultValues: customerDetails ?? { hasNoMiddleName: false },
  });
  const useCustomerAccountCreationRequest = () => {
    return useMutation((data: AccountSetup) =>
      customerAccountCreationRequest.execute(data)
    );
  };
  const { mutate } = useCustomerAccountCreationRequest();
  const { next } = useActiveSteps(MAX_CUSTOMER_STEPS);
  const {
    formState: { isValid },
    handleSubmit,
    resetField,
  } = form;
  const handleContinue = () => {
    handleSubmit((values) => {
      setOpen(!open);
      const obj = {
        firstname: values.firstname,
        middlename: customerDetails?.middlename,
        lastname: values.lastname,
        email: values.email,
        username: values.username,
        password: values.password,
        phoneNumber: "+63" + values.phoneNumber,
        branch: 0,
      };
      setCustomerDetails(values);
      mutate(obj, {
        onSuccess: (response: any) => {
          const { data }: any = response;
          if (data == 200) {
            handleOnToast(
              "Successfully Created an Account. Please Verify your account",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "success"
            );
            setOpen(false);
            next();
          } else {
            setOpen(false);
            handleOnToast(
              "Email already exist",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            resetField("email");
          }
        },
      });
    })();
  };
  return (
    <FormProvider {...form}>
      <UncontrolledCard>
        <Typography variant="overline">
          Customer Account Registration
        </Typography>
        <hr />
        <CustomerAccountForm />
        <NormalButton
          sx={{
            float: "right",
            mt: 2,
            mb: 2,
          }}
          variant="outlined"
          size="small"
          children="CREATE"
          onClick={handleContinue}
          disabled={!isValid}
        />
      </UncontrolledCard>
      <ControlledBackdrop open={open} />
    </FormProvider>
  );
};
