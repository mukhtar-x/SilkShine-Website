'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { ShoppingBag, Menu, X, Globe, Moon, Sun } from 'lucide-react';

const Navbar: React.FC = () => {
    const { cart } = useApp();
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ur' : 'en');
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 py-2">
                <div className="container mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link href="/" className="pb-5 text-2xl md:text-3xl font-black tracking-tight text-amber-600 flex items-center gap-2 font-urdu">
                        SilkShine
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex dark:text-white items-center gap-8 font-medium text-md">
                        <Link href="/" className="text-gray-800 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">{t('home')}</Link>
                        <Link href="/products" className="text-gray-800 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">{t('products')}</Link>
                        <Link href="/about" className="text-gray-800 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">{t('story')}</Link>
                    </div>

                    {/* Right Action Icons & Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className={`flex items-center gap-1 md:gap-2 ${language === 'ur' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center dark:text-white gap-1 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 px-2 md:px-3 py-1.5 rounded-full transition-colors text-xs md:text-sm font-semibold"
                                title="Switch Language"
                            >
                                <Globe className="w-4 h-4 md:w-5 md:h-5" />
                                <span>{language === 'en' ? 'EN' : 'اردو'}</span>
                            </button>

                            <button
                                onClick={toggleTheme}
                                className="p-1.5 md:p-2 dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50 rounded-full transition-colors"
                                title="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon className="w-4 h-4 md:w-5 md:h-5" /> : <Sun className="w-4 h-4 md:w-5 md:h-5" />}
                            </button>
                        </div>

                        <div className="h-5 w-px bg-gray-300 dark:bg-gray-800"></div>

                        <Link href="/cart" className="relative p-1.5 md:p-2 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 rounded-full transition-colors">
                            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-gray-800 dark:text-gray-200" />
                            {cart.length > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        <button
                            className="md:hidden p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-800 dark:text-gray-200"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden dark:text-white fixed inset-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg pt-24 px-8 flex flex-col gap-6 text-lg font-bold">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 transition-colors">{t('home')}</Link>
                    <Link href="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 transition-colors">{t('products')}</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 transition-colors">{t('story')}</Link>
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 transition-colors">{t('contact')}</Link>
                </div>
            )}
        </>
    );
};

export default Navbar;
