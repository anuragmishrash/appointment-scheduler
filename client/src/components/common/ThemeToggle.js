import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useThemeMode } from '../../theme/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '50%',
  width: 40,
  height: 40,
  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(4px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 10px rgba(0, 0, 0, 0.3)'
    : '0 4px 10px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.4)' : 'rgba(255, 255, 255, 0.4)',
  }
}));

// Sun/moon icon animation variants
const iconVariants = {
  hidden: { 
    opacity: 0,
    rotate: -180,
    scale: 0.5,
    y: 20,
  },
  visible: { 
    opacity: 1,
    rotate: 0,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  },
  exit: { 
    opacity: 0,
    rotate: 180,
    scale: 0.5,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeMode();
  
  // Create circular shine effect on click
  const handleClick = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.transform = 'translate(-50%, -50%) scale(0)';
    circle.style.backgroundColor = mode === 'dark' ? '#ffcc80' : '#5a9cff';
    circle.style.opacity = '0.4';
    circle.style.pointerEvents = 'none';
    
    const rect = button.getBoundingClientRect();
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
    
    button.appendChild(circle);
    
    circle.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.7 },
        { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 }
      ],
      {
        duration: 500,
        easing: 'ease-out'
      }
    );
    
    setTimeout(() => {
      circle.remove();
      toggleTheme();
    }, 300);
  };
  
  return (
    <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <StyledIconButton onClick={handleClick} aria-label="toggle theme">
        <motion.div
          key={mode}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={iconVariants}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </motion.div>
      </StyledIconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 