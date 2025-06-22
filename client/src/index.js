import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './theme/ThemeContext';
import { CustomToast } from './components/common/CustomToast';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <CustomToast />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
); 