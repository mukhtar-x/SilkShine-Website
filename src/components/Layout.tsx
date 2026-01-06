
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, Menu, X, Globe, Moon, Sun } from 'lucide-react';


const Layout: React.FC = () => {
    const { cart } = useApp();
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Keep state for menu absolute
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ur' : 'en');
    };

    return (
        <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold tracking-tight text-yellow-600 flex items-center gap-2 font-urdu">
                        SilkShine
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8 font-medium">
                        <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all hover:-translate-y-0.5">{t('home')}</Link>
                        <Link to="/products" className="text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all hover:-translate-y-0.5">{t('products')}</Link>
                        <Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all hover:-translate-y-0.5">{t('story')}</Link>
                        <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all hover:-translate-y-0.5">{t('contact')}</Link>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 relative">
                        {/* Controls Container */}
                        <div className={`flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Language Switcher */}
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded-full transition-colors text-sm font-medium"
                                title="Switch Language"
                            >
                                <Globe className="w-4 h-4" />
                                <span>{language === 'en' ? 'EN' : 'اردو'}</span>
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                title="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

                        <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            {cart.length > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        <button
                            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-30 bg-white dark:bg-gray-900 pt-20 px-4 transition-colors">
                    <div className="flex flex-col gap-4 text-lg text-gray-900 dark:text-white">
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>{t('home')}</Link>
                        <Link to="/products" onClick={() => setIsMenuOpen(false)}>{t('products')}</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)}>{t('story')}</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>{t('contact')}</Link>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-black text-gray-600 dark:text-gray-400 py-12 border-t border-gray-100 dark:border-gray-800 transition-colors shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none relative z-10">
                <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-500 mb-4 flex items-center gap-2 font-urdu">SilkShine</h3>
                        <p className="text-sm leading-relaxed">Pure, organic care for your hair. Nature's best kept secret bottled for you.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-gray-900 dark:text-white">{t('quickLinks')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/products" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">{t('products')}</Link></li>
                            <li><Link to="/about" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">{t('story')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-gray-900 dark:text-white">{t('connect')}</h4>
                        <p className="text-sm">social@silkshine.com</p>
                    </div>
                </div>
                <div className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                    © {new Date().getFullYear()} SilkShine. {t('copyright')}
                </div>
            </footer>
        </div>
    );
};

export default Layout;
