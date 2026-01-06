import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

            {/* Navigation */}
            <nav className={`fixed w-full z-10 backdrop-blur-md border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-pink-600' : 'from-purple-600 to-pink-600'}`}>
                                SaaSify
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button className={`px-4 py-2 rounded-lg font-medium transition-all ${theme === 'dark' ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Fast</span>.<br />
                        Scale <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-green-400 to-lime-400">Infinitely</span>.
                    </h1>
                    <p className={`mt-4 text-xl md:text-2xl max-w-3xl mx-auto mb-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        The ultimate starting point for your next great web application. Modern, responsive, and clear code structure.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity flex items-center shadow-lg shadow-indigo-500/30">
                            Start Building <ArrowRight className="ml-2" size={20} />
                        </button>
                        <button className={`px-8 py-4 rounded-xl font-bold text-lg border transition-colors ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900'}`}>
                            Documentation
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="text-yellow-500" size={40} />}
                            title="Lightning Fast"
                            description="Powered by Vite and optimized React for instant load times."
                            theme={theme}
                        />
                        <FeatureCard
                            icon={<Shield className="text-green-500" size={40} />}
                            title="Secure by Default"
                            description="Best practices implemented out of the box for maximum security."
                            theme={theme}
                        />
                        <FeatureCard
                            icon={<Globe className="text-blue-500" size={40} />}
                            title="Global Scale"
                            description="Ready to deploy to the edge with zero configuration."
                            theme={theme}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-12 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                        © 2026 SaaSify. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, theme }: { icon: React.ReactNode, title: string, description: string, theme: string }) => (
    <div className={`p-8 rounded-2xl border transition-all hover:scale-105 duration-300 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
        <div className="mb-4 bg-gray-100/10 w-fit p-3 rounded-xl">{icon}</div>
        <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{description}</p>
    </div>
);

export default LandingPage;
