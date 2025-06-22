import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { card3DHover } from '../../theme/animations';

const CardWrapper = styled(motion.div)(({ theme, elevation = 1, hoverEffect = true }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  transformStyle: 'preserve-3d',
  transformOrigin: 'center',
  perspective: '1000px',
  transition: 'all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : '#ffffff',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[elevation],
  border: theme.palette.mode === 'dark' 
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.05)',
  
  '&:hover': hoverEffect ? {
    boxShadow: theme.shadows[elevation + 2],
    transform: 'scale(1.02)',
  } : {},
  
  // Gradient shadow at the bottom
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '30%',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)'
      : 'linear-gradient(to top, rgba(0, 0, 0, 0.05), transparent)',
    pointerEvents: 'none',
    opacity: 0.6,
    transition: 'opacity 0.3s ease',
  },
  
  '&:hover::after': hoverEffect ? {
    opacity: 1,
  } : {},
  
  // Subtle glow effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    background: theme.palette.mode === 'dark'
      ? `radial-gradient(circle at 50% 0%, rgba(58, 123, 213, 0.15), transparent 40%)`
      : `radial-gradient(circle at 50% 0%, rgba(58, 123, 213, 0.05), transparent 40%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    zIndex: 0,
  },
  
  '&:hover::before': hoverEffect ? {
    opacity: 1,
  } : {},
}));

const CardContent = styled('div')({
  position: 'relative',
  zIndex: 1,
  height: '100%',
  width: '100%',
});

const Card3D = ({ 
  children, 
  elevation = 1,
  hoverEffect = true,
  tiltEffect = true,
  style = {},
  ...props 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const cardRef = useRef(null);

  // Track mouse position for 3D effect
  const handleMouseMove = (e) => {
    if (!tiltEffect || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    if (size.width === 0 || size.height === 0) {
      setSize({
        width: rect.width,
        height: rect.height
      });
    }
  };

  const handleMouseLeave = () => {
    if (!tiltEffect) return;
    // Reset to center position when mouse leaves
    setMousePosition({ x: size.width / 2, y: size.height / 2 });
  };

  return (
    <CardWrapper
      ref={cardRef}
      initial="rest"
      whileHover={tiltEffect ? "hover" : ""}
      variants={tiltEffect ? card3DHover : {}}
      custom={{
        offsetX: mousePosition.x,
        offsetY: mousePosition.y,
        width: size.width,
        height: size.height
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      elevation={elevation}
      hoverEffect={hoverEffect}
      style={style}
      {...props}
    >
      <CardContent>
        {children}
      </CardContent>
    </CardWrapper>
  );
};

export default Card3D; 