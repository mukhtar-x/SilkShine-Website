'use client';

import React from 'react';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AppProvider } from '@/lib/context/AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
