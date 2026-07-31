'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const defaultLanguageContext: LanguageContextType = {
    language: 'en',
    setLanguage: () => {},
    t: (key: string) => key,
    dir: 'ltr'
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { t, i18n } = useTranslation();
    const getNormalizedLanguage = (lang: string) => {
        if (!lang) return 'en';
        const base = lang.split('-')[0].toLowerCase();
        return base === 'ur' ? 'ur' : 'en';
    };

    const [language, setLanguageState] = useState(getNormalizedLanguage(i18n.language));

    const setLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguageState(getNormalizedLanguage(lang));
    };

    useEffect(() => {
        setLanguageState(getNormalizedLanguage(i18n.language));
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
    return context || defaultLanguageContext;
};
