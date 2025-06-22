import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

// Create a theme context
const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useThemeMode = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get theme preference from localStorage or default to light theme
  const [mode, setMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme || 'light';
  });

  // Function to toggle theme
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    
    // Update document body background color
    document.body.style.backgroundColor = 
      mode === 'light' ? lightTheme.palette.background.default : darkTheme.palette.background.default;
    
    // Update meta theme-color for mobile devices
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content", 
        mode === 'light' ? lightTheme.palette.primary.main : darkTheme.palette.primary.dark
      );
    }
  }, [mode]);

  // Get current theme based on mode
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 