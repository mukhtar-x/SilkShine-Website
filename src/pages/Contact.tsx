
import React from 'react';
import { CONTACT_DATA } from '../constants/content';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Mail, Phone, Send } from 'lucide-react';

const Contact: React.FC = () => {
    const { language, t: translate } = useLanguage();
    const t = (obj: any) => obj[language] || obj['en'] || Object.values(obj)[0];

    const getIcon = (name: string) => {
        switch (name) {
            case 'MapPin': return <MapPin className="w-6 h-6" />;
            case 'Mail': return <Mail className="w-6 h-6" />;
            case 'Phone': return <Phone className="w-6 h-6" />;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in-up">
            <div className="text-center mb-16 dark:text-white">
                <h1 className="text-4xl font-bold mb-4">{t(CONTACT_DATA.title)}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">{t(CONTACT_DATA.subtitle)}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Form */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">{translate('contact')} Us</h2>
                    <form className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Name" className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-yellow-500 dark:text-white w-full" />
                            <input type="email" placeholder="Email" className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-yellow-500 dark:text-white w-full" />
                        </div>
                        <input type="text" placeholder="Subject" className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-yellow-500 dark:text-white w-full" />
                        <textarea rows={4} placeholder="Message" className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-yellow-500 dark:text-white w-full"></textarea>
                        <button className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <Send className="w-5 h-5" /> Send Message
                        </button>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="space-y-6">
                    {CONTACT_DATA.info.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center shrink-0">
                                {getIcon(item.icon)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t(item.title)}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{t(item.value)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contact;
