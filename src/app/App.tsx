
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import AppRoutes from '../routes/AppRoutes';
import Loader from '../components/Loader';
import '../i18n'; // Initialize i18n

const App: React.FC = () => {
  // 1. Loading State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // if (loading) {
  //   return <Loader />;
  // }

  // 2. Main App Structure
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AppProvider>
            {loading && <Loader />}
            <AppRoutes />
          </AppProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
