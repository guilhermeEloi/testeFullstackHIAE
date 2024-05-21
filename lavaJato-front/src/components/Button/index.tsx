import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface ButtonComponentProps extends ButtonProps {
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
    title: string;
    backgroundColor?: string;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
    width,
    height,
    fontSize,
    variant,
    title,
    disabled = false,
    color,
    size,
    startIcon,
    endIcon,
    fullWidth,
    onClick,
    backgroundColor
}) => {
    return (
        <Button
            variant={variant}
            disabled={disabled}
            color={color}
            size={size}
            startIcon={startIcon}
            endIcon={endIcon}
            fullWidth={fullWidth}
            onClick={onClick}
            style={{
                width,
                fontSize,
                height,
                backgroundColor,
            }}
        >
            {title}
        </Button>
    );
}

export default ButtonComponent;
