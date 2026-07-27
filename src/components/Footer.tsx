import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="w-full bg-slate-950 text-gray-300 px-8 md:px-16 py-12 border-t border-slate-800 mt-auto">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="space-y-3">
                    <h3 className="text-2xl font-black text-amber-500 font-urdu">SilkShine</h3>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                        Engineered lubricants and industrial-grade engine oils built to withstand heavy heat and maximize machinery life.
                    </p>
                </div>

                <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">{t('quickLinks')}</h4>
                    <ul className="space-y-2 text-xs text-gray-400">
                        <li><Link to="/products" className="hover:text-amber-400 transition-colors">{t('products')}</Link></li>
                        <li><Link to="/about" className="hover:text-amber-400 transition-colors">{t('story')}</Link></li>
                        <li><Link to="/#process" className="hover:text-amber-400 transition-colors">Process Breakdown</Link></li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">Quality Standards</h4>
                    <ul className="space-y-2 text-xs text-gray-400">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> ISO 9001 Certified</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> 5-Stage Micro Filtered</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> B2B Drum Deliveries</li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">{t('connect')}</h4>
                    <p className="text-xs text-gray-400">Support & Corporate Orders:</p>
                    <p className="text-xs font-semibold text-amber-400">info@silkshine.com</p>
                    <p className="text-xs font-semibold text-gray-300">+92 300 1234567</p>
                </div>
            </div>

            <div className="container mx-auto pt-6 border-t border-slate-900 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} SilkShine Petroleum Lubrication Systems. {t('copyright')}
            </div>
        </footer>
    );
};

export default Footer;