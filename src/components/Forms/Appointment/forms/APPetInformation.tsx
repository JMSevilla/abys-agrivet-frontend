import { ControlledTextField } from "@/components/TextField/TextField";
import { ControlledSelectField } from "@/components/SelectField";
import { useState, useEffect } from "react";
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";
import PetsIcon from '@mui/icons-material/Pets';
import {
    useForm,
    useFormContext,
    FormProvider,
    useFieldArray
} from 'react-hook-form'
import { useAtom } from "jotai";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { zodResolver } from "@hookform/resolvers/zod";
import { APPetInformationBaseSchema } from "@/utils/schema/Appointment/AppointmentSchema";  
import { AppointmentPetInformationAtom } from "@/utils/hooks/useAtomic";
import { MAX_APPOINTMENT_STEPS } from "..";
import { AppointmentPetInformationType } from "@/utils/schema/Appointment/AppointmentSchema";
import { ControlledRichTextField } from "@/components/TextField/RichTextField";
import { Container, Grid, Typography } from "@mui/material";
import { UncontrolledCard } from "@/components/Card/Card";
import { NormalButton } from "@/components/Button/NormalButton";
import { ControlledGrid } from "@/components/Grid/Grid";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { ControlledCheckbox } from "@/components/Checkbox/Checkbox";

const PetInformationForm = () => {
    const {
        control, setValue, watch, trigger, resetField
    } = useFormContext<AppointmentPetInformationType>()
    const [pets, setPets] = useState<Array<{
        name: string,
        label: string,
        value: string
    }>>([
        {
            label: 'Dog',
            name: 'Dog',
            value: 'dog'
        },
        {
            label: 'Cat',
            name: 'Cat',
            value: 'cat'
        },
        {
            label: 'Others',
            name: 'Others',
            value: 'Others'
        }
    ])
    const { fields, append, remove } = useFieldArray({
        name: 'petInfo',
        control
    })
    const addMorePets = () => {
        append({ petName: "", petType: "", otherConcerns: "" })
    }
    return (
        <>
        <UncontrolledCard>
            <Typography variant="overline">Pet Information</Typography><br />
            <Typography variant="caption">You can add your pets information here.</Typography>
            <hr />
            <NormalButton 
            sx={{float: 'right', mt:2, mb: 2}}
            size='small'
            children='ADD NEW PET'
            variant="outlined"
            startIcon={<PetsIcon />}
            onClick={() => addMorePets()}
            />
            <Container sx={{mt: 8}}>
                {
                    fields.map((item, i) => (
                        <>
                            <div key={i}>
                                <UncontrolledCard style={{marginBottom: '10px', borderRadius: '20px'}}>
                                    <NormalButton 
                                    sx={{ float: 'right', mt: 2, mb: 2}}
                                    variant='outlined'
                                    size='small'
                                    color='error'
                                    children='REMOVE'
                                    onClick={() => remove(i)}
                                    />
                                <ControlledGrid>
                                    <Grid item xs={6}>
                                        <ControlledTextField 
                                        control={control}
                                        name={`petInfo.${i}.petName`}
                                        required
                                        shouldUnregister
                                        label='Pet name'
                                        />
                                        <ControlledSelectField 
                                        control={control}
                                        name={`petInfo.${i}.petType`}
                                        options={pets}
                                        required
                                        shouldUnregister
                                        label='What pet do you have?'
                                        />
                                        <ControlledTextField 
                                        control={control}
                                        name={`petInfo.${i}.vetName`}
                                        shouldUnregister
                                        label='Veterinarian name (Optional)'
                                        sx={{ mb: 2 }}
                                        />
                                        <ControlledRichTextField 
                                        handleChange={
                                            (e) => setValue(`petInfo.${i}.otherConcerns`, e)
                                        }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <img 
                                        src='https://cdn.dribbble.com/userupload/2646500/file/original-edeeb85577ee5b5890ea6238113906f4.png?compress=1&resize=1200x900'
                                        style={{
                                            borderRadius: '50px',
                                            height: 'auto',
                                            width: '100%',
                                            marginTop: '20px'
                                        }}
                                        alt='pets'
                                        />
                                    </Grid>
                                </ControlledGrid>
                                </UncontrolledCard>
                            </div>
                        </>
                    ))
                }
            </Container>
        </UncontrolledCard>
        </>
    )
}

export const PetInformation = () => {
    const [petsInformation, setPetsInformation] = useAtom(AppointmentPetInformationAtom)
    const form = useForm<AppointmentPetInformationType>({
        mode: 'all',
        resolver: zodResolver(APPetInformationBaseSchema),
        defaultValues: petsInformation
    })
    const { next } = useActiveSteps(MAX_APPOINTMENT_STEPS)
    const { formState: {isValid}, handleSubmit } = form;
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                setPetsInformation(values)
                next()
            }
        )()
        return false;
    }
    return (
        <FormProvider {...form}>
            <PetInformationForm />
            <BottomButtonGroup 
            disabledContinue={!isValid}
            max_array_length={MAX_APPOINTMENT_STEPS}
            onContinue={handleContinue}
            />
        </FormProvider>
    )
}