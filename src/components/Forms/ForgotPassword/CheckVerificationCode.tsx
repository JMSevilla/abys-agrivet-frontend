import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";
import { ControlledGrid } from "@/components/Grid/Grid";
import { ControlledTextField } from "@/components/TextField/TextField";
import { FPAtom, FPVerificationCode } from "@/utils/hooks/useAtomic";
import { baseCheckVerificationCode, baseVerificationType } from "@/utils/schema/Account/ForgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { MAX_FP_STEPS } from ".";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { useState } from "react";
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";


const CheckCodeForm = () => {
    const { control } = useFormContext<baseVerificationType>();

    return (
        <>
            <ControlledGrid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <ControlledTextField 
                    control={control}
                    name='code'
                    required
                    shouldUnregister
                    />
                </Grid>
                <Grid item xs={4}></Grid>
            </ControlledGrid>
        </>
    )
}

export const CheckCode = () => {
    const [checkcode, setCode] = useAtom(FPVerificationCode)
    const [providedEmail, setProvidedEmail] = useAtom(FPAtom)
    const [loading, setLoading] = useState(false)
    const checkverificationcode = useApiCallBack(async (api, args:{
        code: string,
        email: string | undefined,
        type?: string | undefined
    }) => await api.abys.CheckSMSVerification(args))
    const form = useForm<baseVerificationType>({
        mode: 'all',
        resolver: zodResolver(baseCheckVerificationCode),
        defaultValues: checkcode
    })
    const { 
        formState : {
            isValid
        },
        handleSubmit
    } = form;
    const { handleOnToast } = useToastContext()
    const { next } = useActiveSteps(MAX_FP_STEPS)
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                const obj = {
                    code: values.code,
                    email: providedEmail?.email,
                    type: 'forgot-password'
                }
                setLoading(!loading)
                checkverificationcode.execute(obj)
                .then((res) => {
                    if(res.data == 200) {
                        handleOnToast(
                            "Successfully Verified",
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
                          setLoading(false)
                    }
                })
            }
        )()
    }
    return (
        <FormProvider {...form}>
            <Typography variant='button'>Forgot Password | Check verification code</Typography>
                <br />
                <Typography variant="caption">System will check your verification code</Typography>
                <hr />
            <CheckCodeForm />
            <BottomButtonGroup 
            disabledContinue={!isValid}
            max_array_length={MAX_FP_STEPS}
            onContinue={handleContinue}
            />
            <ControlledBackdrop open={loading} />
        </FormProvider>
    )
}