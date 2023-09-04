import { ControlledGrid } from "@/components/Grid/Grid"
import { useActiveSteps } from "@/utils/hooks/useActiveStep"
import { Card, CardContent, Grid, Typography } from "@mui/material"
import { useState } from "react"
import { MAX_FP_STEPS } from "."
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup"
import { useAtom } from "jotai"
import { FPAtom, FPPhoneAtom } from "@/utils/hooks/useAtomic"
import { useApiCallBack } from "@/utils/hooks/useApi"
import { SMSVerificationProps } from "@/utils/types"
import { useToastContext } from "@/utils/context/Toast/ToastContext"
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop"
import { useForm } from "react-hook-form"
import { baseFPPhone, baseFPPhoneNumber } from "@/utils/schema/Account/ForgotPasswordSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import ControlledModal from "@/components/Modal/Modal"
import { UncontrolledCard } from "@/components/Card/Card"
import { ControlledMobileNumberField } from "@/components/TextField/MobileNumberField"

export const CheckPickVerification = () => {
    const [phoneAtom , setPhoneAtom] = useAtom(FPPhoneAtom)
    const [smsModal, setSmsModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)
    const [fp, setfp] = useAtom(FPAtom)
    const sendsmtpservice = useApiCallBack(async (api, args: SMSVerificationProps) =>
    await api.abys.SendSMSVerification(args))
    const { handleOnToast } = useToastContext()
    const handleCardSelected = (cardId: any) => {
        setSelectedCard(cardId)
    }
    const isCardSelected = (cardId: any) => {
        return selectedCard === cardId;
    };
    const form = useForm<baseFPPhone>({
        mode: 'all',
        resolver: zodResolver(baseFPPhoneNumber),
        defaultValues: phoneAtom
    })
    const {
        getValues, control
    } = form;
    const { next } = useActiveSteps(MAX_FP_STEPS)
    const handleContinue = () => {
        const values = getValues()
        const obj = {
            email: fp?.email,
            code: 'auto-generated-server-side',
            resendCount: 0,
            isValid: 1,
            type: selectedCard == 1 ? 'email' : 'sms',
            verificationCredentials : {
                email: fp?.email,
                phoneNumber: values.phoneNumber
            }
        }
        setLoading(!loading)
        sendsmtpservice.execute(obj)
                        .then((i) => {
                            if(i.data == 200) {
                                handleOnToast(
                                    "Verification code has been sent on your email",
                                    "top-right",
                                    false,
                                    true,
                                    true,
                                    true,
                                    undefined,
                                    "dark",
                                    "success"
                                  );
                                  setLoading(false)
                                  next()
                            } else {
                                handleOnToast(
                                    "You have reached the maximum sent code.",
                                    "top-right",
                                    false,
                                    true,
                                    true,
                                    true,
                                    undefined,
                                    "dark",
                                    "error"
                                  );
                                  setLoading(false)
                            }
                        })
    }
    return (
        <>
            <ControlledGrid>
                <Grid item xs={6}>
                <Card
                                onClick={() => handleCardSelected(1)}
                                sx={{
                                    backgroundColor: isCardSelected(1) ? '#f0f0f0' : 'white',
                                    boxShadow: isCardSelected(1) ? '0 0 5px 2px #3f51b5' : '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                                    cursor: 'pointer',
                                    borderRadius: '20px'
                                  }}
                                >
                                    <CardContent>
                                    <div style={{ textAlign: 'center'}}>
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
                        <Typography variant="overline">
                        Choose <strong>Email</strong> Service for appointment reminder
                        </Typography>{" "}
                        <br />
                        <Typography variant="caption">
                        You will received an email notification regarding your appointment
                        </Typography>
                        </div>
                                    </CardContent>
                                </Card>
                </Grid>
                <Grid item xs={6}>
                <Card
                                onClick={() => {handleCardSelected(2), setSmsModal(!smsModal)}}
                                sx={{
                                    backgroundColor: isCardSelected(2) ? '#f0f0f0' : 'white',
                                    boxShadow: isCardSelected(2) ? '0 0 5px 2px #3f51b5' : '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                                    cursor: 'pointer',
                                    borderRadius: '20px'
                                  }}
                                >
                                    <CardContent>
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
              <Typography variant="overline">
                Choose <strong>SMS</strong> Service for appointment reminder
              </Typography>{" "}
              <br />
              <Typography variant="caption">
                You will received an sms notification regarding your appointment
              </Typography>
            </div>
                                    </CardContent>
                                </Card>
                </Grid>
            </ControlledGrid>
            <ControlledBackdrop open={loading} />
            <ControlledModal
            open={smsModal}
            title="Phone number entry"
            buttonTextAccept="SAVE"
            buttonTextDecline="CANCEL"
            handleClose={() => {setSmsModal(false), handleCardSelected(1)}}
            handleDecline={() => {setSmsModal(false), handleCardSelected(1)}}
            maxWidth="sm"
            handleSubmit={() => setSmsModal(false)}
            >
                <UncontrolledCard>
                    <ControlledMobileNumberField 
                        control={control}
                        name='phoneNumber'
                        label='Mobile Number'
                        required
                        shouldUnregister
                    />
                </UncontrolledCard>
            </ControlledModal>
            <BottomButtonGroup 
            max_array_length={MAX_FP_STEPS}
            disabledContinue={selectedCard == null ? true : false}
            onContinue={handleContinue}
            />
        </>
    )
}