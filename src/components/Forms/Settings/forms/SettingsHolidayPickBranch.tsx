import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";
import { ControlledGrid } from "@/components/Grid/Grid";
import { ControlledSelectField } from "@/components/SelectField";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { HolidayPickAtom } from "@/utils/hooks/useAtomic";
import { BaseHolidayPickSchema, HolidayPickType } from "@/utils/schema/Appointment/HolidaySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@mui/material";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useQuery } from "react-query";
import { MAX_SETTINGS_STEPS } from ".";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import RadioGroupForm from "@/components/GroupRadio/RadioGroupButton";
import { UncontrolledCard } from "@/components/Card/Card";

const SettingsHolidayPickBranchForm = () => {
    const { control } = useFormContext<HolidayPickType>()
    const [branches, setBranches] = useState([])
    const getallBranches = useApiCallBack(api => api.abys.GetAllBranches())
    const { data } = useQuery({
        queryKey: 'getAllBranch',
        queryFn: () => getallBranches.execute().then((response) => response.data)
    })
    useEffect(() => {
        setBranches(data)
    }, [data])

    return (
        <>
        <ControlledGrid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
                <ControlledSelectField 
                control={control}
                name='branch_id'
                options={branches}
                label='Choose branch'
                required
                shouldUnregister
                />
                <UncontrolledCard style={{marginTop: '10px'}}>
                <RadioGroupForm 
                control={control}
                name='value'
                label="Select if it is holiday or store closing"
                options={[
                    {
                        value: 'closed', label: 'Store Closing'
                    },
                    {
                        value: 'holiday', label: 'Holiday'
                    }
                ]}
                />
                </UncontrolledCard>
            </Grid>
            <Grid item xs={4}></Grid>
        </ControlledGrid>
        </>
    )
}


export const SettingsHolidayPickBranch = () => {
    const [pick, setPick] = useAtom(HolidayPickAtom)
    const form = useForm<HolidayPickType>({
        mode: 'all',
        resolver: zodResolver(BaseHolidayPickSchema),
        defaultValues: pick
    })
    const {
        formState: {isValid},
        handleSubmit
    } = form;
    const { next } = useActiveSteps(MAX_SETTINGS_STEPS)
    const handleContinue = () => {
        handleSubmit((values) => {
            setPick(values)
            next()
        })()
        return false;
    }
    return (
        <FormProvider {...form}>
            <SettingsHolidayPickBranchForm />
            <BottomButtonGroup 
            disabledContinue={!isValid}
            max_array_length={MAX_SETTINGS_STEPS}
            onContinue={handleContinue}
            />
        </FormProvider>
    )
}