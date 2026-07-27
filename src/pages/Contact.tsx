import React from 'react';
import { CONTACT_DATA } from '../constants/content';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
    const { language, t: translate } = useLanguage();
    const t = (obj: any) => obj[language] || obj['en'] || Object.values(obj)[0];

    const getIcon = (name: string) => {
        switch (name) {
            case 'MapPin': return <MapPin className="w-5 h-5" />;
            case 'Mail': return <Mail className="w-5 h-5" />;
            case 'Phone': return <Phone className="w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950">
            <Navbar />

            <div className="flex-grow pt-10 md:pt-10 pb-10">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-amber-500/10 shadow-xl flex flex-col justify-between">
                        
                        <div className="text-center max-w-xl mx-auto mb-8">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                                {t(CONTACT_DATA.title)}
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {t(CONTACT_DATA.subtitle)}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full items-start">
                            <div className="bg-gray-50/80 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <h2 className="text-lg font-bold mb-4 dark:text-white">{translate('contact')} Us</h2>
                                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <input type="text" placeholder="Name" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 ring-amber-500 dark:text-white w-full" />
                                        <input type="email" placeholder="Email" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 ring-amber-500 dark:text-white w-full" />
                                    </div>
                                    <input type="text" placeholder="Subject" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 ring-amber-500 dark:text-white w-full" />
                                    <textarea rows={4} placeholder="Message" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 ring-amber-500 dark:text-white w-full resize-none"></textarea>
                                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs shadow-md shadow-amber-500/20">
                                        <Send className="w-4 h-4" /> Send Message
                                    </button>
                                </form>
                            </div>

                            <div className="space-y-4">
                                {CONTACT_DATA.info.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                                            {getIcon(item.icon)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xs text-gray-900 dark:text-white mb-0.5">{t(item.title)}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{t(item.value)}[cite: 14]</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center text-[11px] text-gray-400 border-t border-gray-200/60 dark:border-gray-800 pt-6 mt-8">
                            SilkShine Petroleum Support Center — Operating Mon - Sat 9:00 AM to 6:00 PM
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;