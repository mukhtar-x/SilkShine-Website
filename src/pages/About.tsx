import React from 'react';
import { ABOUT_DATA, BENEFITS_DATA } from '../constants/content';
import { useLanguage } from '../context/LanguageContext';
import about1 from '../assets/about-1.jpg';
import about2 from '../assets/about-2.jpg';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const About: React.FC = () => {
    const { language } = useLanguage();
    const t = (obj: any) => obj?.[language] || obj?.['en'] || (typeof obj === 'object' ? Object.values(obj)[0] : obj);

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Navbar />
            
            <div className="flex-grow">
                {/* SECTION 1: HERO / STORY */}
                <section className="w-full min-h-screen px-4 md:px-8 py-8">
                    <div className="container  mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-amber-500/10 shadow-xl flex flex-col justify-between overflow-hidden">
                        <div className="grid min-h-[500px] lg:grid-cols-12 gap-6 items-center">
                            
                            {/* Text Content */}
                            <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
                                <span className="inline-flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Our Journey
                                </span>

                                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
                                    {t(ABOUT_DATA.hero.title)}
                                </h1>

                                <h2 className="text-sm md:text-base font-bold text-amber-600 dark:text-amber-400">
                                    {t(ABOUT_DATA.story.title)}
                                </h2>

                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    {t(ABOUT_DATA.story.content)}
                                </p>

                                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200/60 dark:border-gray-800">
                                    {ABOUT_DATA.stats.map((stat, idx) => (
                                        <div key={idx} className="text-center lg:text-left">
                                            <div className="text-xl md:text-2xl font-black text-amber-500">{stat.value}</div>
                                            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t(stat.label)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Image Showcase */}
                            <div className="lg:col-span-5 relative flex items-center justify-center gap-3">
                                <div className="relative w-1/2 aspect-[4/5] max-h-56 md:max-h-64 rounded-2xl overflow-hidden shadow-md border-2 border-white dark:border-gray-800 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                                    <img src={about1} alt="About 1" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative w-1/2 aspect-[4/5] max-h-56 md:max-h-64 rounded-2xl overflow-hidden shadow-md border-2 border-white dark:border-gray-800 transform rotate-3 translate-y-2 hover:rotate-0 transition-transform duration-300">
                                    <img src={about2} alt="About 2" className="w-full h-full object-cover" />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section className="w-full px-4 min-h-screen md:px-8 py-8">
                    <div className="container max-h-[600px]  mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-amber-500/10 shadow-xl flex flex-col justify-between overflow-hidden">
                        
                        {/* Header */}
                        <div className="text-center max-w-xl mx-auto mb-6">
                            <span className="inline-flex items-center gap-1.5 text-amber-500 font-bold text-xs uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Uncompromised Quality
                            </span>
                            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white">
                                {language === 'en' ? 'Why Choose SilkShine?' : 'سلک شائن کا انتخاب کیوں؟'}
                            </h2>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {BENEFITS_DATA.map((benefit, idx) => (
                                <div 
                                    key={idx} 
                                    className="group bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-500/50 transition-all duration-300 shadow-sm"
                                >
                                    <div className="space-y-1">
                                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xs">
                                            0{idx + 1}
                                        </div>
                                        <h3 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                                            {t(benefit.title)}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
                                            {t(benefit.content)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Badge Footer */}
                        <div className="pt-4 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>Formulated with 100% certified organic botanical extracts & micro-filtered oils.[cite: 12]</span>
                        </div>

                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default About;