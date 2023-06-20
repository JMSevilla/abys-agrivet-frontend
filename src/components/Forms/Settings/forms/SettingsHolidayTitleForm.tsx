import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";
import { ControlledGrid } from "@/components/Grid/Grid";
import { ControlledTextField } from "@/components/TextField/TextField";
import { HolidayTitleAtom } from "@/utils/hooks/useAtomic";
import { BaseHolidayTitleSchema, HolidayTitleType } from "@/utils/schema/Appointment/HolidaySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@mui/material";
import { useAtom } from "jotai";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { MAX_SETTINGS_STEPS } from ".";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";

const HolidayTitleForm = () => {
    const { 
        control
    } = useFormContext<HolidayTitleType>()

    return (
        <>
        <ControlledGrid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
                <ControlledTextField 
                control={control}
                name='title'
                required
                shouldUnregister
                label='Provide holiday title'
                />
            </Grid>
            <Grid item xs={4}></Grid>
        </ControlledGrid>
        </>
    )
}

export const HolidayTitle = () => {
    const [title, setTitle] = useAtom(HolidayTitleAtom)
    const form = useForm<HolidayTitleType>({
        mode: 'all',
        resolver: zodResolver(BaseHolidayTitleSchema),
        defaultValues: title
    })
    const {
        formState : { isValid },
        handleSubmit
    } = form;
    const { next } = useActiveSteps(MAX_SETTINGS_STEPS)
    const handleContinue = () => {
        handleSubmit((values) => {
            setTitle(values)
            next()
        })()
        return false;
    }
    return (
        <FormProvider {...form}>
            <HolidayTitleForm />
            <BottomButtonGroup 
            disabledContinue={!isValid}
            hideBack
            max_array_length={MAX_SETTINGS_STEPS}
            onContinue={handleContinue}
            />
        </FormProvider>
    )
}
