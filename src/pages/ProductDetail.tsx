import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants/products';
import { useLanguage } from '../context/LanguageContext';
import { Star, Truck, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCT_DETAILS_CONTENT } from '../constants/content';

import about1 from '../assets/about-1.jpg';
import about2 from '../assets/about-2.jpg';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useApp();
    const { t, language } = useLanguage();

    const tp = (obj: any) => obj[language] || obj['en'];

    const product = PRODUCTS.find((p) => p.id === Number(id));

    const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950">
            <Navbar />

            <div className="flex-grow pt-28 md:pt-32 pb-16">
                {!product ? (
                    <div className="container mx-auto px-4 py-32 text-center space-y-6">
                        <h2 className="text-4xl font-bold dark:text-white">Product not found</h2>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all"
                        >
                            Back to Products
                        </button>
                    </div>
                ) : (
                    <div className="container mx-auto px-4 py-8 animate-fade-in-up max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <div className="max-h-[500px] aspect-square bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden relative group shadow-lg border border-gray-100 dark:border-gray-800">
                                    <img
                                        src={[product.image, about1, about2][activeImage]}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex gap-3 p-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-700">
                                    {[product.image, about1, about2].map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`flex-1 aspect-square rounded-xl overflow-hidden border transition-all duration-300 ${activeImage === index ? 'border-yellow-500 scale-95 ring-2 ring-yellow-500/10' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col justify-center space-y-6">
                                <div className="space-y-1">
                                    <div className="text-yellow-600 dark:text-yellow-400 font-bold tracking-widest uppercase text-xs">{t('shopCollection')}</div>
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">{product.name}</h1>
                                    <div className="flex items-center gap-3 pt-1">
                                        <div className="flex text-yellow-500 scale-90">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                                            ))}
                                        </div>
                                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">{product.reviews} Verified {t('reviews')}</span>
                                    </div>
                                </div>

                                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg font-light italic">
                                    "{product.description}"
                                </p>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Choose your size</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-6 py-2.5 rounded-xl border-2 font-bold transition-all duration-300 text-sm ${selectedSize === size ? 'border-yellow-500 bg-yellow-500 text-black shadow-md' : 'border-gray-100 dark:border-gray-800 hover:border-yellow-200 dark:hover:border-yellow-900 dark:text-gray-300'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-5">
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                                        <span className="text-gray-400 text-sm line-through mb-1">${(product.price * 1.2).toFixed(2)}</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => {
                                                addToCart(product, selectedSize);
                                                navigate('/cart');
                                            }}
                                            className="flex-1 bg-black dark:bg-yellow-500 text-white dark:text-black px-8 py-3.5 rounded-2xl font-bold hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            {t('addToCart')}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 group text-sm">
                                            <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl group-hover:text-yellow-500 transition-colors">
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold">{t('fastDelivery')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 group text-sm">
                                            <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl group-hover:text-yellow-500 transition-colors">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold">{t('labTested')}[cite: 15]</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 space-y-12">
                            <div className="bg-gray-50/50 dark:bg-gray-900/20 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl md:text-2xl font-bold mb-6 dark:text-white text-center">
                                    {language === 'en' ? 'Product Features' : 'مصنوعات کی خصوصیات'}
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {PRODUCT_DETAILS_CONTENT.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:border-yellow-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{tp(feature)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-bold dark:text-white">{language === 'en' ? 'How to Use' : 'استعمال کا طریقہ'}</h2>
                                    <div className="w-12 h-1 bg-yellow-500 mx-auto rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {PRODUCT_DETAILS_CONTENT.usage.map((step, idx) => (
                                        <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative group overflow-hidden">
                                            <div className="text-3xl font-black text-yellow-500/10 absolute top-1 right-1 group-hover:text-yellow-500/20 transition-colors">{idx + 1}</div>
                                            <h3 className="font-bold text-base mb-1.5 dark:text-white group-hover:text-yellow-600 transition-colors leading-tight">{tp(step.title)}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">{tp(step.desc)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-10 md:p-12 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden transition-colors">
                                <div className="relative z-10 text-center space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl md:text-3xl font-bold dark:text-white">{language === 'en' ? 'Natural Ingredients' : 'قدرتی اجزاء'}</h2>
                                        <p className="text-yellow-600 dark:text-yellow-400 text-xs uppercase tracking-widest font-bold">100% Organic & Cold Pressed</p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                                        {PRODUCT_DETAILS_CONTENT.ingredients.map((ing, idx) => (
                                            <span key={idx} className="px-4 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-yellow-500 hover:text-yellow-600 transition-all cursor-default rounded-lg border border-gray-100 dark:border-gray-700 font-semibold text-xs">
                                                {ing}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;