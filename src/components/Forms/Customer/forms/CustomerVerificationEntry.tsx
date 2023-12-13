import React, { useState, useEffect } from "react";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import {
  ControlledBackdrop,
  ControlledGrid,
  NormalButton,
  UncontrolledCard,
} from "@/components";
import { Grid, Typography } from "@mui/material";
import { ControlledTextField } from "@/components";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { useMutation } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_CUSTOMER_STEPS } from "..";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { useAtom } from "jotai";
import {
  CustomerAccountCreationAtom,
  VerificationAccountAtom,
} from "@/utils/hooks/useAtomic";
import {
  VerificationAccountType,
  verificationBaseSchema,
} from "@/utils/schema/Account/CustomerRegistrationSchema";

const VerificationFormField = () => {
  const { control } = useFormContext<VerificationAccountType>();

  return (
    <>
      <ControlledGrid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            name="code"
            required
            shouldUnregister
            label="Verification Code"
          />
        </Grid>
        <Grid item xs={4}></Grid>
      </ControlledGrid>
    </>
  );
};

export const VerificationForm = () => {
  const [verification, setVerification] = useAtom(VerificationAccountAtom);
  const [customerDetails, setCustomerDetails] = useAtom(
    CustomerAccountCreationAtom
  );
  const [loading, setLoading] = useState(false);
  const { next } = useActiveSteps(MAX_CUSTOMER_STEPS);
  const checkVerificationCodeRequest = useApiCallBack(
    async (api, args: { code: string; email: string | undefined }) =>
      await api.abys.CheckSMSVerification(args)
  );
  const resendVerification = useApiCallBack(
    async (api, args: { type: string; email: string | undefined }) =>
      await api.abys.ResendSMS(args)
  );
  const useResendVerification = useMutation(
    (data: { type: string; email: string | undefined }) =>
      resendVerification.execute(data)
  );
  const form = useForm<VerificationAccountType>({
    mode: "all",
    resolver: zodResolver(verificationBaseSchema),
    defaultValues: verification,
  });
  const useCheckVerificationCode = () => {
    return useMutation((data: { code: string; email: string | undefined }) =>
      checkVerificationCodeRequest.execute(data)
    );
  };
  const { handleOnToast } = useToastContext();
  const { mutate } = useCheckVerificationCode();
  const {
    formState: { isValid },
    handleSubmit,
    resetField,
  } = form;
  const handleContinue = () => {
    handleSubmit((values) => {
      const obj = {
        code: values.code,
        email: customerDetails?.email,
      };
      setLoading(!loading);
      mutate(obj, {
        onSuccess: (response: any) => {
          const { data }: any = response;
          if (data == 200) {
            handleOnToast(
              "Succesfully Verified",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "success"
            );
            setLoading(false);
            next();
          } else {
            handleOnToast(
              "Invalid verification code",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setLoading(false);
            resetField("code");
          }
        },
      });
    })();
    return false;
  };
  const handleResend = () => {
    const resendObj = {
      type: "sms",
      email: customerDetails?.email,
    };
    setLoading(!loading);
    useResendVerification.mutate(resendObj, {
      onSuccess: (response: any) => {
        const { data }: any = response;
        if (data == 200) {
          handleOnToast(
            "Succesfully Sent Verification Code",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
          );
          setLoading(false);
        } else {
          handleOnToast(
            "You have reached the maximum request kindly use the last code sent.",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "error"
          );
          setLoading(false);
        }
      },
    });
  };
  return (
    <FormProvider {...form}>
      <UncontrolledCard>
        <Typography variant="overline">
          Customer Account Verification
        </Typography>
        <VerificationFormField />
        <div
          style={{
            display: "flex",
            float: "right",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <NormalButton
            variant="outlined"
            size="small"
            onClick={handleResend}
            color="warning"
          >
            RESEND
          </NormalButton>
          &nbsp;
          <NormalButton
            variant="outlined"
            size="small"
            onClick={handleContinue}
            disabled={!isValid}
          >
            VERIFY
          </NormalButton>
        </div>
      </UncontrolledCard>
      <ControlledBackdrop open={loading} />
    </FormProvider>
  );
};
