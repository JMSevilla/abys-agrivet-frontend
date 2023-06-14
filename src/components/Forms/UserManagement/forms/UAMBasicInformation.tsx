import { ControlledTextField } from "@/components/TextField/TextField";
import { ControlledGrid } from "@/components/Grid/Grid";
import { Grid, IconButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";

import {
    useForm,
    FormProvider,
    useFormContext,
} from 'react-hook-form'

import { useAtom } from "jotai";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { ControlledSelectField, SingleOption } from "@/components/SelectField";
import { useQuery } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { UAMAccountType, uam_schema } from "@/utils/schema/Account/UAMSchema";

import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { ControlledCheckbox } from "@/components/Checkbox/Checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { UAMAccountCreationAtom } from "@/utils/hooks/useAtomic";
import { MAX_UAM_UAM_STEPS } from "..";
import { ControlledMobileNumberField } from "@/components/TextField/MobileNumberField";


const UAMBasicInformationForm = () => {
    const [accessLevel, setAccessLevel] = useState<Array<{
        name: string,
        label: string,
        value: number
    }>>([
        {
            label: 'Manager',
            name: 'manager',
            value: 2
        },
        {
            label: 'Administrator',
            name: 'administrator',
            value: 1
        }
    ])
    const GetBranchAvailable = useApiCallBack(api => api.abys.GetAllBranches())
    const [branch, setBranch] = useState<SingleOption[]>([])
    const { data } = useQuery({
        queryKey: "FetchAllBranches",
        queryFn: () => GetBranchAvailable.execute().then((response) => response.data)
    })
    useEffect(() => {
        setBranch(data)
    }, [data])
    const {
        control, watch, trigger, getValues, resetField, setError
     } = useFormContext<UAMAccountType>()
    const hasNoMiddleName = watch('hasNoMiddleName')
    const hasNoMiddleNamePreviousValue = usePreviousValue(hasNoMiddleName)
    const mobileNumber = watch('phoneNumber')
    const branchValue = watch('branch')
    const phoneNumberRegex = /^(\+?63|0)9\d{9}$/;
    useEffect(() => {
        resetField('middlename')
        if(hasNoMiddleNamePreviousValue){
            trigger('middlename')
        }
        

    }, [hasNoMiddleName, hasNoMiddleNamePreviousValue, resetField, trigger])
    useEffect(() => {
        const values = getValues()
        if(phoneNumberRegex.test(values.phoneNumber)){
            return;
        }else{
            setError('phoneNumber', { message: 'Invalid phone number'})
        }
    }, [mobileNumber])
    useEffect(() => {
        const values = getValues()
        const newArrayAccessLevel: Array<{
            name: string,
            label: string,
            value: number
        }> = [{
            name: 'administrator',
            label: 'Administrator',
            value: 1
        }]
        const oldNewArrayAccessLevel: Array<{
            name: string,
            label: string,
            value: number
        }> = [{
            label: 'Manager',
            name: 'manager',
            value: 2
        }]
        if(values.branch == 6){
            setAccessLevel(newArrayAccessLevel)
        } else {
            setAccessLevel(oldNewArrayAccessLevel)
        }
    }, [branchValue])

    return (
        <>
            <ControlledGrid>
                <Grid item xs={4}>
                    <ControlledTextField 
                        control={control}
                        name='firstname'
                        label='Firstname'
                        required
                        shouldUnregister
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextField 
                        control={control}
                        name='middlename'
                        label='Middlename'
                        disabled={hasNoMiddleName}
                        required={!hasNoMiddleName}
                        shouldUnregister
                    />
                    <ControlledCheckbox 
                    control={control}
                    name='hasNoMiddleName'
                    label='I do not have a middlename'
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledTextField 
                    control={control}
                    name='lastname'
                    label='Lastname'
                    required
                    shouldUnregister
                    />
                </Grid>
            </ControlledGrid>
            <ControlledGrid>
                <Grid item xs={3}>
                    <ControlledTextField 
                    control={control}
                    name='username'
                    label='Username'
                    required
                    shouldUnregister
                    />
                </Grid>
                <Grid item xs={3}>
                <ControlledMobileNumberField 
                        control={control}
                        name='phoneNumber'
                        required
                        shouldUnregister
                        label="Mobile Number"
                    />
                </Grid>
                <Grid item xs={3}>
                    <ControlledSelectField 
                    control={control}
                    name='branch'
                    label='Select Branch'
                    required
                    shouldUnregister
                    options={branch}
                    />
                </Grid>
                <Grid item xs={3}>
                <ControlledSelectField 
                    control={control}
                    name='access_level'
                    label='Select Access Level'
                    required
                    shouldUnregister
                    options={accessLevel}
                    />
                </Grid>
            </ControlledGrid>
        </>
    )
}

export const UAMBasicInformation = () => {
    const [uamAtom, setUAMAtom] = useAtom(UAMAccountCreationAtom)
    const form = useForm<UAMAccountType>({
        mode: 'all',
        resolver: zodResolver(uam_schema),
        defaultValues: uamAtom ?? { hasNoMiddleName : false }
    })
    const { next } = useActiveSteps(MAX_UAM_UAM_STEPS)
    const {
        formState: { isValid },
        handleSubmit
    } = form;
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                setUAMAtom(values)
                next()
            }
        )()
        return false;
    }
    return (
        <FormProvider {...form}>
            <UAMBasicInformationForm />
            <BottomButtonGroup 
            disabledContinue={!isValid}
            max_array_length={MAX_UAM_UAM_STEPS}
            hideBack
            onContinue={handleContinue}
            />
        </FormProvider>
    )
}