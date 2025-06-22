import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageVariants } from '../../theme/animations';

// Page transition component
const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 