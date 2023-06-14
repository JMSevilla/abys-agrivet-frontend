import { ControlledTextField } from "@/components/TextField/TextField";
import { ControlledGrid } from "@/components/Grid/Grid";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";

import {
    useForm,
    FormProvider,
    useFormContext
} from 'react-hook-form'

import { useAtom } from "jotai";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { MAX_APPOINTMENT_STEPS } from "..";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledMobileNumberField } from "@/components/TextField/MobileNumberField";
import { AppointmentAtom } from "@/utils/hooks/useAtomic";
import { APBaseSchema, AppointmentType } from "@/utils/schema/Appointment/AppointmentSchema";
import { useBranchPath, useReferences } from "@/utils/hooks/useToken";
import { decrypt } from "@/utils/config/encryptor";

const APBasicInformationForm = () => {
    const {
        control
    } = useFormContext<AppointmentType>()

    return (
        <>
            <ControlledGrid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <ControlledTextField 
                    control={control}
                    name='fullname'
                    label='Fullname'
                    shouldUnregister
                    required
                    disabled
                    />
                    <ControlledTextField 
                    control={control}
                    name='email'
                    label='Email'
                    shouldUnregister
                    required
                    disabled
                    />
                    <ControlledMobileNumberField 
                    control={control}
                    name='phoneNumber'
                    shouldUnregister
                    required
                    disabled
                    label='Mobile number'
                    />
                </Grid>
                <Grid item xs={4}></Grid>
            </ControlledGrid>
        </>
    )
}

export const APBasicInformation = () => {
    const [appointmentAtom, setAppointmentAtom] = useAtom(AppointmentAtom)
    const form = useForm<AppointmentType>({
        mode: 'all',
        resolver: zodResolver(APBaseSchema),
        defaultValues: appointmentAtom
    })
    const { next } = useActiveSteps(MAX_APPOINTMENT_STEPS)
    const [references, setReferences] = useReferences()
    const {
        formState : { isValid },
        handleSubmit, setValue, watch
    } = form;
    const fullname = watch('fullname')
    const email = watch('email')
    const phoneNumber = watch('phoneNumber')
    useEffect(() => {
        const mobileNum = references?.phoneNumber;
        const sanitizedPhoneNumber = mobileNum.replace("+63", "")
        setValue('email', references?.email)
        setValue('fullname', references?.firstname + " " + references?.lastname)
        setValue('phoneNumber', sanitizedPhoneNumber)
    }, [fullname, email, phoneNumber])
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                setAppointmentAtom(values)
                next()
            }
        )()
        return false;
    }
    return (
        <FormProvider {...form}>
            <APBasicInformationForm />
            <BottomButtonGroup 
            disabledContinue={!isValid}
            max_array_length={MAX_APPOINTMENT_STEPS}
            hideBack
            onContinue={handleContinue}
            />
        </FormProvider>
    )
}