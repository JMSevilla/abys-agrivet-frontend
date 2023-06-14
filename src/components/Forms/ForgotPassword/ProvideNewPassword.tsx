import { ControlledGrid } from "@/components/Grid/Grid";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter/PasswordStrengthMeter";
import { ControlledTextField } from "@/components/TextField/TextField";
import { FPNewPasswordBaseSchema, FPNewPasswordType } from "@/utils/schema/Account/ForgotPasswordSchema";
import { Grid, Typography } from "@mui/material";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { FPAtom, FPNewPasswordAtom } from "@/utils/hooks/useAtomic";
import { zodResolver } from "@hookform/resolvers/zod";
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";
import { MAX_FP_STEPS } from ".";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useMutation } from "react-query";
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useRouter } from "next/router";

const options = {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
  };
  zxcvbnOptions.setOptions(options);
const FPNewPasswordForm = () => {
    const {
        control, getValues, watch
    } = useFormContext<FPNewPasswordType>()
    const passwordHasValue = watch('password')
    useEffect(() => {}, [passwordHasValue])
    const result = zxcvbn(getValues().password == undefined ? "" : getValues().password);
    return (
        <>
            <ControlledGrid>
                <Grid item xs={6}>
                    <ControlledTextField 
                        control={control}
                        name='password'
                        required
                        shouldUnregister
                        label="New password"
                        type="password"
                    />
                    <PasswordStrengthMeter password={getValues().password} result={result} />
                </Grid>
                <Grid item xs={6}>
                    <ControlledTextField 
                    control={control}
                    name='conpassword'
                    required
                    shouldUnregister
                    label="Confirm password"
                    type="password"
                    />
                </Grid>
            </ControlledGrid>
        </>
    )
}

export const FPNewPassword = () => {
    const [providedEmail, setProvidedEmail] = useAtom(FPAtom)
    const [newpassword, setNewPassword] = useAtom(FPNewPasswordAtom)
    const [loading, setLoading] = useState(false)
    const form = useForm<FPNewPasswordType>({
        mode: 'all',
        resolver: zodResolver(FPNewPasswordBaseSchema),
        defaultValues: newpassword
    })
    const change_password = useApiCallBack(async(api, args: {
        email: string | undefined,
        password: string | undefined
    }) => await api.users.ChangePassword(args))
    const {
        formState : {
            isValid
        },
        handleSubmit
    } = form;
    const useChangePassword = () => {
        return useMutation((data : {email: string | undefined, password: string | undefined}) => change_password.execute(data))
    }
    const router = useRouter()
    const { handleOnToast } = useToastContext()
    const { mutate } = useChangePassword()
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                const obj = {
                    email: providedEmail?.email,
                    password: values.password
                }
                setLoading(!loading)
                mutate(obj, {
                    onSuccess: (response) => {
                        const { data } = response;
                        if(data == 200) {
                            handleOnToast(
                                "Successfully Change your password",
                                false,
                                true,
                                true,
                                true,
                                undefined,
                                "dark",
                                "success"
                            );
                            setLoading(false)
                            router.push('/login')
                        } else {
                            handleOnToast(
                                "Something went wrong",
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
                    }
                })
            }
        )()
    }
    return (
        <FormProvider {...form}>
            <Typography variant='button'>Forgot Password | New Credentials</Typography>
                <br />
                <Typography variant="caption">Provide your new password.</Typography>
                <hr />
                <FPNewPasswordForm />
                <BottomButtonGroup 
                disabledContinue={!isValid}
                max_array_length={MAX_FP_STEPS}
                hideBack
                onContinue={handleContinue}
                />
                <ControlledBackdrop open={loading} />
        </FormProvider>
    )
}