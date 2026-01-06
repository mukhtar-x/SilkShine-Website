
import React from 'react';
import { ABOUT_DATA, BENEFITS_DATA } from '../constants/content';
import { useLanguage } from '../context/LanguageContext';
import about1 from '../assets/about-1.jpg';
import about2 from '../assets/about-2.jpg';

const About: React.FC = () => {
    const { language } = useLanguage();
    const t = (obj: any) => obj[language];

    return (
        <div className="animate-fade-in-up space-y-20 pb-20">
            {/* Hero / Our Story Section */}
            <section className="container mx-auto px-4 mt-8">
                <div className="relative bg-yellow-50 dark:bg-gray-900 rounded-[2.5rem] shadow-xl overflow-hidden px-8 py-16 md:p-20 grid md:grid-cols-2 gap-16 items-center border border-yellow-100 dark:border-gray-800 transition-colors">

                    {/* Background Overlays (Matches Home Theme) */}
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/40 z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-white to-white dark:from-yellow-900/40 dark:via-gray-900 dark:to-black z-0 opacity-50 dark:opacity-100"></div>

                    {/* Left Column: Text Content */}
                    <div className="order-1 relative z-10 dark:text-white animate-fade-in-up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            {t(ABOUT_DATA.hero.title)}
                        </h1>
                        <h2 className="text-2xl font-medium text-yellow-600 dark:text-yellow-400 mb-8">
                            {t(ABOUT_DATA.story.title)}
                        </h2>
                        <p className="text-lg text-gray-800 dark:text-gray-300 leading-relaxed mb-10 font-normal">
                            {t(ABOUT_DATA.story.content)}
                        </p>

                        <div className="grid grid-cols-3 gap-8 border-t border-gray-200/60 dark:border-gray-700/60 pt-10">
                            {ABOUT_DATA.stats.map((stat, idx) => (
                                <div key={idx} className="text-center group">
                                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-500 transition-colors">{stat.value}</div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">{t(stat.label)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Images */}
                    <div className="order-2 relative z-10 h-full min-h-[500px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-yellow-200 dark:bg-yellow-900/20 rounded-full blur-3xl opacity-30 z-0 scale-75"></div>
                        <div className="relative z-10 w-full grid grid-cols-2 gap-4">
                            <img
                                src={about1}
                                className="rounded-3xl shadow-lg border-4 border-white dark:border-gray-800 w-full h-80 object-cover transform translate-y-12 hover:-translate-y-2 transition-transform duration-500"
                                alt="Oil"
                            />
                            <img
                                src={about2}
                                className="rounded-3xl shadow-lg border-4 border-white dark:border-gray-800 w-full h-80 object-cover transform -translate-y-4 hover:translate-y-2 transition-transform duration-500"
                                alt="Process"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-yellow-50 to-white dark:from-gray-900 dark:to-black p-8 md:p-12 shadow-lg border border-yellow-100 dark:border-gray-800">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-10"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {language === 'en' ? 'Why Choose SilkShine?' : 'سلک شائن کا انتخاب کیوں؟'}
                            </h2>
                            <div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {BENEFITS_DATA.map((benefit, idx) => (
                                <div key={idx} className="group bg-white dark:bg-white/5 backdrop-blur-sm p-6 rounded-2xl hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-white/10 hover:border-yellow-200 dark:hover:border-yellow-500/50 hover:-translate-y-0.5 shadow-sm">
                                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">{t(benefit.title)}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-medium dark:font-light group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                                        {t(benefit.content)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
