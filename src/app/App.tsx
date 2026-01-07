
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import AppRoutes from '../routes/AppRoutes';
import Loader from '../components/Loader';
import '../i18n'; // Initialize i18n
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  // 1. Loading State
  const { i18n, ready } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We want to show the loader for at least 1.5s for branding/smoothness
    // but we MUST wait for i18n to be ready.
    const minTimer = setTimeout(() => {
      if (ready && i18n.isInitialized) {
        setLoading(false);
      }
    }, 1500);

    if (ready && i18n.isInitialized) {
      // If already ready, the timer will handle the minimum visibility
    } else {
      // If not ready, wait for it
      const handleInitialized = () => {
        // Still respect the minimum timer if it's still running
      };
      i18n.on('initialized', handleInitialized);
      return () => {
        clearTimeout(minTimer);
        i18n.off('initialized', handleInitialized);
      };
    }

    return () => clearTimeout(minTimer);
  }, [ready, i18n]);

  // Use a second useEffect to sync loading state when ready changes
  useEffect(() => {
    if (ready && i18n.isInitialized && loading) {
      const timeout = setTimeout(() => setLoading(false), 500); // Small extra buffer
      return () => clearTimeout(timeout);
    }
  }, [ready, i18n, loading]);

  // 2. Main App Structure
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AppProvider>
            {loading ? (
              <Loader />
            ) : (
              <AppRoutes />
            )}
          </AppProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
