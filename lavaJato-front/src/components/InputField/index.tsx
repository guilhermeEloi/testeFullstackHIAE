import React, { useState, ChangeEvent } from 'react';
import { TextField, IconButton, InputAdornment, TextFieldProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface InputFieldProps {
  width?: string | number;
  height?: string | number;
  id: string;
  type: string;
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  disabled?: boolean;
  variant?: TextFieldProps['variant'];
  color?: string;
  name?: string;
  length?: number;
  fullWidth?: boolean;
  multiline?: boolean;
  fontSize?: string | number;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'initial' | 'inherit';
}

const InputField: React.FC<InputFieldProps> = ({
  width,
  height,
  id,
  type,
  label,
  onChange,
  value,
  disabled = false,
  variant = 'outlined',
  color,
  name,
  length,
  fullWidth = false,
  multiline = false,
  fontSize,
  textTransform,
}) => {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <TextField
      id={id}
      label={label}
      variant={variant}
      disabled={disabled}
      type={isPassword && showPassword ? 'text' : type}
      name={name}
      onChange={onChange}
      value={value}
      fullWidth={fullWidth}
      multiline={multiline}
      InputProps={{
        ...(isPassword && {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={handleTogglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }),
        sx: {
          width,
          height,
          fontSize,
          color,
        },
      }}
      inputProps={{
        form: {
          autoComplete: 'off',
        },
        maxLength: length || undefined,
        style: {
          textTransform,
        }
      }}
      InputLabelProps={{
        sx: {
          fontSize: '20px',
          color,
          fontFamily: 'Roboto, sans-serif',
        },
      }}
    />
  );
};

export default InputField;
