import { AnimatePresence, motion } from 'framer-motion';

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

// Fade in animation variants
export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

// Staggered items animation for lists
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation for individual staggered items
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    }
  }
};

// 3D hover animation for cards
export const card3DHover = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  hover: ({ offsetX, offsetY, width, height }) => {
    // Calculate tilt based on mouse position
    // Constrain to ±15 degrees
    if (!width || !height) return { scale: 1.02 };
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    const rotateX = ((offsetY - centerY) / centerY) * -7;
    const rotateY = ((offsetX - centerX) / centerX) * 7;
    
    return {
      rotateX,
      rotateY,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    };
  }
};

// Button scale animation
export const scaleAnimation = {
  hover: { 
    scale: 1.03, 
    transition: { 
      duration: 0.2 
    } 
  },
  tap: { 
    scale: 0.97, 
    transition: { 
      duration: 0.1 
    } 
  }
};

// Ripple effect function
export const rippleEffect = (event, color = "rgba(0, 0, 0, 0.1)") => {
  const button = event.currentTarget;
  
  // Create ripple element
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  // Style the ripple
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.position = "absolute";
  ripple.style.borderRadius = "50%";
  ripple.style.backgroundColor = color;
  ripple.style.transform = "scale(0)";
  ripple.style.animation = "ripple 0.6s linear";
  ripple.classList.add("ripple-effect");
  
  // Ensure button has position relative for absolute positioning of the ripple
  button.style.position = "relative";
  button.style.overflow = "hidden";
  
  // Add ripple to button
  button.appendChild(ripple);
  
  // Remove ripple after animation completes
  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// Modal animation variants
export const modalVariants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      ease: "easeOut",
      duration: 0.2,
    },
  },
};

// Export AnimatePresence for easier use
export { AnimatePresence };

// Motion components
export const MotionContainer = motion.div;
export const MotionBox = motion.div;
export const MotionButton = motion.button; 