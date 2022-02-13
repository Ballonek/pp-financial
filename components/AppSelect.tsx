import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { SelectProps } from '@mui/material';
import { RegisterOptions } from 'react-hook-form';

type SelectOption = {
  value: string;
  text: string;
};

export type AppSelectProps = SelectProps & {
  name: string;
  rules?: RegisterOptions;
  options?: SelectOption[];
};

export const AppSelect: FC<AppSelectProps> = ({
  name,
  size,
  className,
  variant,
  label,
  fullWidth,
  sx,
  disabled,
  rules,
  options,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControl fullWidth={fullWidth} size={size} sx={sx} disabled={disabled} variant={variant} className={className}>
          <InputLabel id={`label-${name}`}>{label}</InputLabel>
          <Select labelId={`label-${name}`} label={label} {...field}>
            {options &&
              options.map((option, idx) => (
                <MenuItem key={idx} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
    />
  );
};
