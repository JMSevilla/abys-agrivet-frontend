import {
    Controller, ControllerProps, FieldValues
} from 'react-hook-form'
import { 
    Radio, FormControlLabel, RadioGroup, StackProps, InputLabelProps
} from '@mui/material'
import { z } from 'zod'

export type GroupRadioOption = {
    value: string
    label: string
}
type ControlledField<T extends FieldValues> = Pick<
ControllerProps<T>,
"control" | "name" | "shouldUnregister"
>
type RadioGroupProps = {
    options: GroupRadioOption[]
    control: any
    label: string
}

type ControlledRadioFieldProps<T extends FieldValues> = ControlledField<T> & RadioGroupProps



const RadioGroupForm = <T extends FieldValues>({
    name,
    label,
    options,
    control,
    ...rest
}: ControlledRadioFieldProps<T>) => {
    return (
        <Controller 
        {...rest}
        control={control}
        name={name}
        render={({ field: {onChange, value }, fieldState: {error}}) => (
            <div>
                <label>{label}</label>
                <RadioGroup row value={value ?? ""} onChange={onChange}>
                    {options.map((option) => (
                        <FormControlLabel 
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        />
                    ))}
                </RadioGroup>
                {error && <span>{error.message}</span>}
            </div>
        )}
        />
    )
}

export default RadioGroupForm