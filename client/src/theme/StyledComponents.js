import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Card, Paper, Box } from '@mui/material';

// Glass effect styled component for cards and modals
export const GlassCard = styled(Card)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  /* Responsive padding adjustments */
  @media (max-width: 600px) {
    padding: 15px;
  }
`;

// Dark Glass Card variant
export const DarkGlassCard = styled(GlassCard)`
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);

  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
`;

// Neumorphic button for light theme
export const NeumorphicButton = styled(Button)`
  border-radius: 10px;
  background: #f0f0f0;
  box-shadow: 5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff;
  border: none;
  color: #3a7bd5;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 7px 7px 15px #d1d1d1, -7px -7px 15px #ffffff;
  }

  &:active {
    transform: translateY(0);
    box-shadow: inset 5px 5px 10px #d1d1d1, inset -5px -5px 10px #ffffff;
  }

  /* Responsive padding adjustments */
  @media (max-width: 600px) {
    padding: 10px 18px;
  }
`;

// Neumorphic dark button
export const DarkNeumorphicButton = styled(Button)`
  border-radius: 10px;
  background: #2a2a2a;
  box-shadow: 5px 5px 10px #1c1c1c, -5px -5px 10px #383838;
  border: none;
  color: #5a9cff;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 7px 7px 15px #1c1c1c, -7px -7px 15px #383838;
  }

  &:active {
    transform: translateY(0);
    box-shadow: inset 5px 5px 10px #1c1c1c, inset -5px -5px 10px #383838;
  }
`;

// Gradient Button
export const GradientButton = styled(Button)`
  background: linear-gradient(45deg, #3a7bd5 0%, #00d2ff 100%);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  padding: 12px 25px;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 15px rgba(58, 123, 213, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(58, 123, 213, 0.6);
    background: linear-gradient(45deg, #3a7bd5 30%, #00d2ff 90%);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 3D Card with motion effects
export const Card3D = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  transform-style: preserve-3d;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 12px;
    background: linear-gradient(135deg, #3a7bd5, #00d2ff);
    transform: translateZ(-10px);
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
    transform: translateZ(-20px);
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    padding: 15px;
  }
`;

// Dark 3D Card
export const DarkCard3D = styled(Card3D)`
  background: #1e1e1e;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  color: white;

  &::before {
    background: linear-gradient(135deg, #0058a2, #3a7bd5);
  }
`;

// Page Container with responsive padding
export const PageContainer = styled(Box)`
  padding: 30px 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  /* Responsive padding adjustments */
  @media (max-width: 900px) {
    padding: 25px 30px;
  }
  
  @media (max-width: 600px) {
    padding: 20px 15px;
  }
`;

// Page Header component
export const PageHeader = styled(Box)`
  margin-bottom: 30px;

  @media (max-width: 600px) {
    margin-bottom: 20px;
  }
`;

// Styled Paper for forms and content
export const StyledPaper = styled(Paper)`
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background-color: ${props => props.theme.palette?.background?.paper || '#ffffff'};
  position: relative;
  overflow: hidden;

  /* Optional decorative element */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(to bottom, #3a7bd5, #00d2ff);
  }

  @media (max-width: 600px) {
    padding: 20px 15px;
  }
`;

// Animation wrapper
export const AnimatedContainer = styled(motion.div)`
  width: 100%;
`;

// Form Container
export const FormContainer = styled(Box)`
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
`;

// Custom loader container
export const LoaderContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

export default {
  GlassCard,
  DarkGlassCard,
  NeumorphicButton,
  DarkNeumorphicButton,
  GradientButton,
  Card3D,
  DarkCard3D,
  PageContainer,
  PageHeader,
  StyledPaper,
  AnimatedContainer,
  FormContainer,
  LoaderContainer
}; 