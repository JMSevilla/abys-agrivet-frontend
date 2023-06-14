import {
  TextField,
  Autocomplete,
  MenuItem,
  StackProps,
  InputLabelProps,
  SelectProps,
  Stack,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Controller, FieldValues } from "react-hook-form";
import { ControlledField } from "../TextField";

type FeatureProps = {
  data: Array<{
    label: string;
    value: string;
  }>;
  handleChange: (event: any, values: any) => void;
};

export type MultipleOption = {
  label?: string | undefined;
  value?: any;
  name?: string | undefined;
  branch_id?: any;
  branchName?: string | undefined;
  branchKey?: string | undefined;
  id?: any
  serviceName?: string | undefined
};

export type MultipleBaseSelectFieldProps = Omit<
  SelectProps,
  "onChange" | "value" | "options"
> & {
  label?: string;
  helperText?: string;
  containerProps?: StackProps;
  labelProps?: InputLabelProps;
  value?: string;
  transformValue?: (value: string) => any | undefined;
  getValue?: (value: any) => string;
  onChange?: (...event: any[]) => void;
  multipleOptions?: MultipleOption[];
  isMultiple?: boolean
};

export type MultipleSelectFieldProps<T extends boolean = false> =
  MultipleBaseSelectFieldProps & {
    modalOptions?: T;
  } & (T extends true
      ? MultipleBaseSelectFieldProps
      : MultipleBaseSelectFieldProps);

export function MultipleSelectField<T extends boolean>({
  label,
  helperText,
  error,
  required,
  containerProps = {},
  labelProps = {},
  modalOptions,
  onChange,
  transformValue = (v: string) => v,
  getValue = (value: any) => value,
  multipleOptions = [],
  isMultiple = true,
  ...rest
}: MultipleSelectFieldProps<T>) {
  return (
    <Stack width="100%">
      <Stack gap={1} {...containerProps}>
        {label && (
          <InputLabel error={error} required={required} {...labelProps}>
            {label}
          </InputLabel>
        )}
        <Autocomplete
          multiple={isMultiple}
          options={multipleOptions}
          getOptionLabel={(option: any) => option?.label ?? option?.branchName ?? option.serviceName}
          disableCloseOnSelect
          onChange={(e: any, values: any) =>
            onChange?.(transformValue(values) ?? values)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Multiple Autocomplete"
              placeholder="Multiple Autocomplete"
              error={error}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <MenuItem
              {...props}
              key={option.label ?? option.branchKey ?? option.serviceName}
              value={getValue(option.value ?? option.branch_id ?? option.id) ?? ""}
            >
              {option.label ?? option.branchName ?? option.serviceName}
              {selected ? <CheckIcon color="info" /> : null}
            </MenuItem>
          )}
        />
        {helperText && (
          <FormHelperText error={error}>{helperText}</FormHelperText>
        )}
      </Stack>
    </Stack>
  );
}

export type ControlledMultipleSelectFieldProps<
  T extends FieldValues,
  U extends boolean
> = ControlledField<T> &
  MultipleSelectFieldProps<U> & {
    options: MultipleOption[];
  };

export function ControlledMultipleSelectField<
  T extends FieldValues,
  U extends boolean
>({
  control,
  name,
  shouldUnregister,
  onChange: origOnChange,
  transformValue = (v: string) => v,
  options,
  ...rest
}: ControlledMultipleSelectFieldProps<T, U>) {
  return (
    <Controller
      control={control}
      name={name}
      shouldUnregister={shouldUnregister}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => (
        <MultipleSelectField
          multipleOptions={options}
          error={Boolean(error?.message)}
          helperText={error?.message}
          onChange={(event: any) => {
            onChange(transformValue(event) ?? event);
            origOnChange?.(event);
          }}
          {...rest}
        />
      )}
    />
  );
}
