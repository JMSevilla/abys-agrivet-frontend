import { UncontrolledCard } from "@/components/Card/Card";
import { Typography, Grid } from "@mui/material";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { ControlledGrid } from "@/components/Grid/Grid";
import { useMutation } from "react-query";
import { SMSVerificationProps } from "@/utils/types";
import { useAtom } from "jotai";
import { CustomerAccountCreationAtom } from "@/utils/hooks/useAtomic";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { MAX_CUSTOMER_STEPS } from "..";
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";
import { useState } from "react";
export const ChooseVerificationType = () => {
  const [customerDetails, setCustomerDetails] = useAtom(
    CustomerAccountCreationAtom
  );
  const [loading, setLoading] = useState(false);
  const sendSMSVerification = useApiCallBack(
    async (api, args: SMSVerificationProps) => {
      const result = await api.abys.SendSMSVerification(args);
      return result;
    }
  );
  const useSendSMSVerification = () => {
    return useMutation((data: SMSVerificationProps) =>
      sendSMSVerification.execute(data)
    );
  };
  const { handleOnToast } = useToastContext();
  const { mutate } = useSendSMSVerification();
  const { next } = useActiveSteps(MAX_CUSTOMER_STEPS);
  const handleSendSelection = (type: string) => {
    switch (type) {
      case "sms":
        const smsObject = {
          email: customerDetails?.email,
          code: "auto-generated-server-side",
          resendCount: 0,
          isValid: 1,
          type: "sms",
          phoneNumber: customerDetails?.phoneNumber,
        };
        setLoading(!loading);
        mutate(smsObject, {
          onSuccess: (response: any) => {
            const { data }: any = response;
            if (data == 200) {
              handleOnToast(
                "Verification code has been sent on your phone number",
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
                "You've reached the maximum sent verification request. Please use last sent code.",
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
          onError: (error) => {
            handleOnToast(
              "Something went wrong",
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
          },
        });
        break;
      case "email":
        const emailObject = {
          email: customerDetails?.email,
          code: "auto-generated-server-side",
          resendCount: 0,
          isValid: 1,
          type: "email",
          phoneNumber: customerDetails?.phoneNumber,
        };
        setLoading(!loading);
        mutate(emailObject, {
          onSuccess: (response: any) => {
            const { data }: any = response;
            if (data == 200) {
              handleOnToast(
                "Verification code has been sent on your phone number",
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
                "You've reached the maximum sent verification request. Please use last sent code.",
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
          onError: (error) => {
            handleOnToast(
              "Something went wrong",
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
          },
        });
        break;
    }
  };
  return (
    <>
      <ControlledGrid>
        <Grid item xs={6}>
          <UncontrolledCard
            style={{
              borderRadius: "20px",
              cursor: "pointer",
            }}
            handleClick={() => handleSendSelection("email")}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src="https://email.uplers.com/blog/wp-content/uploads/2022/07/1-Signatures-blog.gif"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "50px",
                }}
              />
              <Typography variant="button">
                Send Verification Code via Email
              </Typography>{" "}
              <br />
              <Typography variant="caption">
                You will received the verification code on your email
              </Typography>
            </div>
          </UncontrolledCard>
        </Grid>
        <Grid item xs={6}>
          <UncontrolledCard
            style={{
              borderRadius: "20px",
              cursor: "pointer",
            }}
            handleClick={() => handleSendSelection("sms")}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src="https://i.pinimg.com/originals/fe/c2/39/fec23921611cc3abb6db1774e284a251.gif"
                style={{
                  width: "54%",
                  height: "auto",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "50px",
                }}
              />
              <Typography variant="button">
                Send Verification Code via SMS
              </Typography>{" "}
              <br />
              <Typography variant="caption">
                You will received the verification code on your email
              </Typography>
            </div>
          </UncontrolledCard>
        </Grid>
        <ControlledBackdrop open={loading} />
      </ControlledGrid>
    </>
  );
};
