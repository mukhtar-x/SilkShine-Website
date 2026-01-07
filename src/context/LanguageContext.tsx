import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

// Use a cast to satisfy TypeScript
const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { t, i18n } = useTranslation();
    const [language, setLanguageState] = useState(i18n.language || 'en');

    const setLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguageState(lang);
    };

    useEffect(() => {
        setLanguageState(i18n.language);
    }, [i18n.language]);

    const value: LanguageContextType = {
        language,
        setLanguage,
        t,
        dir: language === 'ur' ? 'rtl' : 'ltr'
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
