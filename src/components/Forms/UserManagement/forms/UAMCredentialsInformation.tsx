import { ControlledTextField } from "@/components/TextField/TextField";
import { Container, Grid } from "@mui/material";
import { useState, useEffect } from 'react'
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";

import {
    useForm,
    useFormContext,
    FormProvider
} from 'react-hook-form'
import { useAtom } from "jotai";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import { useMutation } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { UAMAccountCreationAtom } from "@/utils/hooks/useAtomic";
import { MAX_UAM_UAM_STEPS } from "..";
import { zodResolver } from "@hookform/resolvers/zod";

import { UAMAccountCredType } from "@/utils/schema/Account/UAMSchema";
import { BaseUAMCredSchema } from "@/utils/schema/Account/UAMSchema";
import { UAMAccountCredentialsAtom } from "@/utils/hooks/useAtomic";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter/PasswordStrengthMeter";
import { UAMProps } from "@/utils/types";
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useUserContext } from "@/utils/context/UserContext/UserContext";
import { useRefreshToken } from "@/utils/hooks/useToken";
import { useRouter } from "next/router";
const options = {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
  };
  zxcvbnOptions.setOptions(options);

const UAMCredentialsInformationForm = () => {
    const {
        control, getValues, watch
    } = useFormContext<UAMAccountCredType>()
    const passwordHasValue = watch('password')
    useEffect(() => {}, [passwordHasValue])
    const result = zxcvbn(getValues().password == undefined ? "" : getValues().password);
    return (
        <>
            <ControlledTextField 
            control={control}
            name='email'
            required
            shouldUnregister
            label="Email"
            />
            <ControlledTextField 
            control={control}
            name='password'
            required
            shouldUnregister
            label='Password'
            type='password'
            />
            <PasswordStrengthMeter result={result} password={getValues().password} />
            <ControlledTextField 
            control={control}
            name='conpassword'
            required
            shouldUnregister
            label='Confirm Password'
            type='password'
            />
        </>
    )
}

export const UAMCredentialsInformation = () => {
    const [credentials, setCredentials] = useAtom(UAMAccountCredentialsAtom)
    const [basicInformation, setBasicInformation] = useAtom(UAMAccountCreationAtom)
    const [loading, setLoading] = useState(false)
    const uamCreateNewAccount = useApiCallBack(async (api, args: UAMProps) => await api.users.UAMCreateNewUser(args))
    
    const useUserAccessManagement = () => {
        return useMutation((data: UAMProps) => 
            uamCreateNewAccount.execute(data)
        );
    }
    const { handleOnToast } = useToastContext()
    const { mutate } = useUserAccessManagement()
    const form = useForm<UAMAccountCredType>({
        mode: 'all',
        resolver: zodResolver(BaseUAMCredSchema),
        defaultValues: credentials
    })
    const {
        formState: { isValid },
        handleSubmit,
        getValues, setError
    } = form;
    const result = zxcvbn(getValues().password == undefined ? "" : getValues().password);
    const { lookAllUsersFromUAM } = useUserContext()
    const checkPasswordErrors = () => {
        const values = getValues()
        if(!values.password) return;
        if(!(result.score > 2)) {
            setError('password', { message : 'Password strength has an error.'})
        }
    }
    useEffect(() => {
        checkPasswordErrors()
    }, [])
    const router = useRouter()
    const { next } = useActiveSteps(MAX_UAM_UAM_STEPS)
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                setLoading(!loading)
                const obj = {
                    firstname: basicInformation?.firstname,
                    middlename: basicInformation?.middlename,
                    lastname: basicInformation?.lastname,
                    username: basicInformation?.username,
                    access_level: basicInformation?.access_level,
                    branch: basicInformation?.branch,
                    email: values.email,
                    password: values.password,
                    phoneNumber: basicInformation?.phoneNumber
                }
                mutate(obj, {
                    onSuccess: (response: any) => {
                        const { data } : any = response;
                        if(data?.status == 'Success'){
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
                            setLoading(false)
                            lookAllUsersFromUAM()
                            next()
                        }
                    }
                })
            }
        )()
        return false;
    }
    return (
        <Container>
            <FormProvider {...form}>
            <UAMCredentialsInformationForm />
            <BottomButtonGroup 
            disabledContinue={!isValid}
            max_array_length={MAX_UAM_UAM_STEPS}
            onContinue={handleContinue}
            />
        </FormProvider>
        <ControlledBackdrop open={loading} />
        </Container>
    )
}