import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useThemeMode } from '../../theme/ThemeContext';

// Import icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Styled toast container
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    margin-bottom: 15px;
    min-height: auto;
  }

  /* Light theme styling */
  .Toastify__toast--light {
    background: rgba(255, 255, 255, 0.85);
    color: #333;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  /* Dark theme styling */
  .Toastify__toast--dark {
    background: rgba(30, 30, 30, 0.9);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  /* Success toast */
  .Toastify__toast--success {
    border-left: 5px solid #43a047;
  }

  /* Error toast */
  .Toastify__toast--error {
    border-left: 5px solid #f44336;
  }

  /* Info toast */
  .Toastify__toast--info {
    border-left: 5px solid #03a9f4;
  }

  /* Warning toast */
  .Toastify__toast--warning {
    border-left: 5px solid #ff9800;
  }

  /* Progress bar styling */
  .Toastify__progress-bar {
    height: 3px;
    border-radius: 0 0 10px 10px;
  }

  /* Responsive styling */
  @media (max-width: 480px) {
    .Toastify__toast {
      margin: 0 15px 15px;
      border-radius: 8px;
      padding: 12px;
    }
  }
`;

// Custom toast content component
const ToastContent = ({ text, icon }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    style={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: '10px'
    }}
  >
    {icon}
    <div>{text}</div>
  </motion.div>
);

// Toast component with theme support
export const CustomToast = () => {
  const { mode } = useThemeMode();

  return (
    <StyledToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={mode}
    />
  );
};

// Custom toast functions
export const showToast = {
  success: (message) => {
    toast.success(
      <ToastContent
        text={message}
        icon={<CheckCircleOutlineIcon style={{ color: '#43a047' }} />}
      />
    );
  },
  error: (message) => {
    toast.error(
      <ToastContent
        text={message}
        icon={<ErrorOutlineIcon style={{ color: '#f44336' }} />}
      />
    );
  },
  info: (message) => {
    toast.info(
      <ToastContent 
        text={message}
        icon={<InfoOutlinedIcon style={{ color: '#03a9f4' }} />} 
      />
    );
  },
  warning: (message) => {
    toast.warning(
      <ToastContent
        text={message}
        icon={<WarningAmberIcon style={{ color: '#ff9800' }} />}
      />
    );
  },
  // Custom themed toast with full control
  custom: (message, options = {}) => {
    toast(
      <ToastContent
        text={message}
        icon={options.icon || <InfoOutlinedIcon style={{ color: options.iconColor || '#03a9f4' }} />}
      />,
      options
    );
  }
};

export default CustomToast; 