import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

export type AppInputProps = TextFieldProps & {
  name: string;
  rules?: RegisterOptions;
  unit?: string;
};

export const AppInput: FC<AppInputProps> = ({
  variant,
  label,
  name,
  className,
  fullWidth,
  type,
  size,
  sx,
  disabled,
  rules,
  unit,
  multiline,
  InputProps,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextField
          multiline={multiline}
          InputProps={{
            endAdornment: <InputAdornment position='end'>{unit}</InputAdornment>,
            ...InputProps,
          }}
          helperText={error?.message}
          error={!!error}
          type={type}
          size={size}
          className={className}
          label={label}
          variant={variant}
          fullWidth={fullWidth}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          sx={sx}
          disabled={disabled}
        />
      )}
    />
  );
};
