import React from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { rippleEffect, scaleAnimation } from '../../theme/animations';

const StyledButton = styled(motion.button)(({ theme, variant, color = 'primary' }) => {
  // Determine background color based on variant and theme color
  const getBackgroundColor = () => {
    if (variant === 'contained') {
      return theme.palette[color]?.main || theme.palette.primary.main;
    }
    return 'transparent';
  };

  // Determine text color based on variant and theme color
  const getTextColor = () => {
    if (variant === 'contained') {
      return theme.palette[color]?.contrastText || '#ffffff';
    }
    return theme.palette[color]?.main || theme.palette.primary.main;
  };

  // Determine border color based on variant and theme color
  const getBorderColor = () => {
    if (variant === 'outlined') {
      return theme.palette[color]?.main || theme.palette.primary.main;
    }
    return 'transparent';
  };

  return {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getBackgroundColor(),
    color: getTextColor(),
    fontWeight: 600,
    padding: '10px 24px',
    fontSize: '0.9rem',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: variant === 'outlined' ? `2px solid ${getBorderColor()}` : 'none',
    boxShadow: variant === 'contained' 
      ? '0 4px 10px rgba(0, 0, 0, 0.1)'
      : 'none',
    textTransform: 'none',
    letterSpacing: '0.5px',
    margin: theme.spacing(0.5),
    
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.1)',
      color: theme.palette.text.disabled,
    },

    // Responsive adjustments
    [theme.breakpoints.down('sm')]: {
      padding: '8px 18px',
      fontSize: '0.8rem',
    },
  };
});

const RippleButton = ({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  style = {},
  ...props
}) => {

  // Handler with ripple effect
  const handleClick = (e) => {
    // Only trigger ripple when button is enabled
    if (!disabled) {
      const rippleColor = variant === 'contained' ? 'rgba(255, 255, 255, 0.4)' : undefined;
      rippleEffect(e, rippleColor);
      
      // Call the original onClick handler if provided
      if (onClick) {
        onClick(e);
      }
    }
  };

  return (
    <StyledButton
      as={motion.button}
      whileHover={!disabled && "hover"}
      whileTap={!disabled && "tap"}
      variants={scaleAnimation}
      disabled={disabled}
      variant={variant}
      color={color}
      onClick={handleClick}
      style={{
        width: fullWidth ? '100%' : 'auto',
        ...style
      }}
      {...props}
    >
      {startIcon && <span style={{ marginRight: '8px', display: 'flex' }}>{startIcon}</span>}
      {children}
      {endIcon && <span style={{ marginLeft: '8px', display: 'flex' }}>{endIcon}</span>}
    </StyledButton>
  );
};

export default RippleButton; 