import { ControlledTextField } from "@/components/TextField/TextField";
import { Typography, Grid } from "@mui/material";
import { baseFPSchema } from "@/utils/schema/Account/ForgotPasswordSchema";
import {
    FormProvider,
    useForm,
    useFormContext
} from 'react-hook-form'
import { FPAccountType } from "@/utils/schema/Account/ForgotPasswordSchema";
import { ControlledGrid } from "@/components/Grid/Grid";
import { useAtom } from "jotai";
import { FPAtom } from "@/utils/hooks/useAtomic";
import { zodResolver } from "@hookform/resolvers/zod";
import { UncontrolledCard } from "@/components/Card/Card";
import { NormalButton } from "@/components/Button/NormalButton";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { PropsWithChildren, useEffect, useState } from "react";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";
import { SMSVerificationProps } from "@/utils/types";
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";
import { MAX_FP_STEPS } from ".";

const CheckEmailForm = () => {
    const { control } = useFormContext<FPAccountType>()
    return (
        <>
            <ControlledGrid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <ControlledTextField 
                    control={control}
                    name='email'
                    label='Email'
                    shouldUnregister
                    required
                    />
                </Grid>
                <Grid item xs={4}></Grid>
            </ControlledGrid>
        </>
    )
}


export const CheckEmail = () => {
    const [fp, setFp] = useAtom(FPAtom)
    const form = useForm<FPAccountType>({
        mode: 'all',
        resolver: zodResolver(baseFPSchema),
        defaultValues: fp
    })
    const [loading, setLoading] = useState(false)
    const checkEmail = useApiCallBack(async (api, email: string) =>
    await api.abys.CheckFPEmail(email))
    const { formState: {isValid}, handleSubmit } = form;
    const { handleOnToast } = useToastContext()
    const { next } = useActiveSteps(MAX_FP_STEPS)
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                setLoading(!loading)
                checkEmail.execute(values.email)
                .then((r) => {
                    if(r.data == "exist") {
                        setFp(values)
                        next()
                    } else {
                        handleOnToast(
                            "There is no account associate on this email.",
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
        return false;
    }
    return (
        <FormProvider {...form}>
            <Typography variant='button'>Forgot Password | Check email</Typography>
                <br />
                <Typography variant="caption">System will check your email</Typography>
                <hr />
               <CheckEmailForm />
               <BottomButtonGroup 
                max_array_length={MAX_FP_STEPS}
                hideBack
                disabledContinue={!isValid}
                onContinue={handleContinue}
                />
            <ControlledBackdrop open={loading} />
        </FormProvider>
    )
}