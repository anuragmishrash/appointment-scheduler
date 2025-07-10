import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import styled from 'styled-components';

const LoaderContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${props => props['data-fullscreen'] === 'true' ? '100vh' : '200px'};
  width: 100%;
  flex-direction: column;
  padding: 30px;
`;

const CalendarGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  width: 120px;
  height: 120px;
  perspective: 500px;
`;

const CalendarCell = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #3a7bd5, #00d2ff);
  border-radius: 6px;
  transform-style: preserve-3d;
  box-shadow: 0 4px 10px rgba(58, 123, 213, 0.3);
`;

const LoaderText = styled(motion.div)`
  margin-top: 30px;
  color: ${props => props.textColor || '#3a7bd5'};
  font-size: 1.2rem;
  font-weight: 500;
`;

// Animation variants for the container
const containerVariants = {
  animate: {
    rotate: [0, 5, 0, -5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Animation variants for each calendar cell
const itemVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 0.5
    }
  })
};

const CustomLoader = ({ text = 'Loading...', fullScreen = false, textColor }) => {
  return (
    <LoaderContainer data-fullscreen={fullScreen.toString()}>
      <CalendarGrid
        animate="animate"
        variants={containerVariants}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <CalendarCell
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          />
        ))}
      </CalendarGrid>
      
      {text && (
        <LoaderText
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5], transition: { repeat: Infinity, duration: 1.5 } }}
          textColor={textColor}
        >
          {text}
        </LoaderText>
      )}
    </LoaderContainer>
  );
};

export default CustomLoader; 