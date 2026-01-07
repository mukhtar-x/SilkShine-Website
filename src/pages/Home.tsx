
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants/products';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import bottleShot from '../assets/bottle-shot.png';
import { ArrowRight, Leaf, ShieldCheck, Star, Truck } from 'lucide-react';

const Home: React.FC = () => {
    const { addToCart } = useApp();
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Show only first 3 products as featured
    const featuredProducts = PRODUCTS.slice(0, 3);

    return (
        <div className="animate-fade-in-up pb-12">
            {/* Hero Section */}
            <section className="relative max-w-[95%]  md:max-h-[82vh] min-h-[80vh]  shadow-xl container mx-auto px-4 mt-8 mb-20 overflow-hidden rounded-[3rem] bg-yellow-50 dark:bg-gray-900 transition-colors">

                {/* Background Layer */}
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-white to-white dark:from-yellow-900/40 dark:via-gray-900 dark:to-black z-0 opacity-50 dark:opacity-100"></div>
                <div className="relative z-10 w-full h-full flex flex-col justify-center min-h-[80vh] py-5 px-4 md:px-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="text-left space-y-6 md:space-y-8 max-w-xl">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                                {t('heroTitle')}
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-200 opacity-90 leading-relaxed font-light">
                                {t('heroSubtitle')}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 md:py-4 md:px-10 rounded-2xl text-base md:text-lg transition-all transform hover:scale-105 shadow-xl shadow-yellow-500/20 flex items-center gap-3"
                                >
                                    {t('shopCollection')} <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-2xl text-base md:text-lg transition-all hover:bg-white dark:hover:bg-gray-800"
                                >
                                    {t('story')}
                                </button>
                            </div>
                        </div>

                        {/* Right: Product Showcase */}
                        <div className="relative flex justify-center items-center">
                            {/* Animated Background Glow */}
                            <div className="absolute w-[120%] h-[120%] bg-yellow-400/30 dark:bg-yellow-500/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>

                            {/* Floating Decorative Elements */}
                            <div className="absolute top-10 -right-10 animate-bounce duration-[3000ms] opacity-20 dark:opacity-40">
                                <Leaf className="w-20 h-20 text-yellow-600 rotate-45" />
                            </div>
                            <div className="absolute -bottom-0 -left-10 animate-pulse opacity-10 dark:opacity-30">
                                <Leaf className="w-32 h-32 text-yellow-700 -rotate-12" />
                            </div>

                            <img
                                src={bottleShot}
                                alt="SilkShine Bottle"
                                className="w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] object-contain drop-shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-700 hover:scale-105 z-10"
                                style={{
                                    WebkitMaskImage: 'radial-gradient(circle, black 75%, transparent 100%)',
                                    maskImage: 'radial-gradient(circle, black 75%, transparent 100%)',
                                    mixBlendMode: 'multiply'
                                }}
                            />
                        </div>
                    </div>
                </div>


            </section>
            {/* Integrated Benefits Bar */}
            <div className="my-5 mx-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center gap-5 px-6 group transition-all">
                    <div className="w-14 h-14 bg-yellow-400/20 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                        <Leaf className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{t('organic')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium tracking-tight">{t('directOrganic')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5 px-6 border-y md:border-y-0 md:border-x border-gray-200/50 dark:border-gray-800/50 group transition-all">
                    <div className="w-14 h-14 bg-yellow-400/20 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{t('labTested')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium tracking-tight">{t('certifiedPurity')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5 px-6 group transition-all">
                    <div className="w-14 h-14 bg-yellow-400/20 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                        <Truck className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{t('fastDelivery')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium tracking-tight">{t('freeShipping')}</p>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <section className="container mx-auto px-4 py-20 relative">
                {/* Decorative background for transition */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-yellow-300 to-transparent dark:from-yellow-700 opacity-50"></div>

                <div className="text-center mb-16 space-y-4">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold tracking-widest uppercase text-sm">{t('shopCollection')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold dark:text-white tracking-tight">{t('bestSellers')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-lg italic">{t('bestNourishment')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                            <div className="h-72 overflow-hidden relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <Link to={`/product/${product.id}`} className="bg-white text-black py-3 px-8 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-yellow-400">
                                        {t('viewDetails')}
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-1 mb-2 text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                    ))}
                                    <span className="text-gray-400 text-sm ml-1">({product.reviews})</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">{product.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-2xl font-bold dark:text-white">${product.price}</span>
                                    <button
                                        onClick={() => addToCart(product, product.sizes[0])}
                                        className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-bold flex items-center gap-2"
                                    >
                                        {t('addToCart')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link to="/products" className="inline-block border-2 border-black dark:border-white text-black dark:text-white px-10 py-3 rounded-full font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                        {t('viewAllProducts')}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;