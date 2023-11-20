import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { StringMappingType } from 'typescript';

interface SelectSmallProps {
  label: string;
  options: any;
  value: string | number;
  onChange: (value: any) => void;
  disabled?: boolean

}

const BasicSelectField: React.FC<SelectSmallProps> = ({ label, options, value, onChange, disabled }) => {
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 520 }} size="small">
      <InputLabel id="select-small-label">{label}</InputLabel>
      <Select
        disabled={disabled}
        labelId="select-small-label"
        id="select-small"
        value={value ?? ""}
        label={label}
        onChange={handleChange}
      >
        {options.map((option: any) => (
          <MenuItem key={option.value ?? option.branch_id} value={option.value ?? option.branch_id}>
            {option.label ?? option.branchName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BasicSelectField;