import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants/products';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import bottleShot from '../assets/bottle-shot.png';
import {
    ArrowRight, Leaf, ShieldCheck, Star, Truck, Play, Factory,
    Droplets, Package, Quote, Sparkles, Eye, ShoppingCart,
    ChevronLeft, ChevronRight, CheckCircle2
} from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';

const Home: React.FC = () => {
    const { addToCart } = useApp();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(1);
    const indexRef = useRef(currentIndex);
    indexRef.current = currentIndex;

    const mainContainerRef = useRef<HTMLDivElement>(null);
    const processSectionRef = useRef<HTMLElement>(null);
    const isProcessInViewRef = useRef(false);
    const isBusyRef = useRef(false);

    const featuredProducts = PRODUCTS.slice(0, 3);

    const reviews = [
        {
            quote: "We switched our transport fleet to Silkshine. Viscosity retention reduced our maintenance costs by 15%.",
            author: "Ahmed Khan",
            role: "Fleet Manager, PakLogistics",
            initials: "AK"
        },
        {
            quote: "The industrial drums arrived strictly on schedule. The 5-stage filtration clarity is evident immediately upon testing.",
            author: "Sana Habib",
            role: "Operations Lead, SteelTech",
            initials: "SH"
        },
        {
            quote: "Our workshop only stocks Silkshine now. Customers notice the engine smoothness instantly.",
            author: "Mustafa Zain",
            role: "Owner, AutoCare Pro",
            initials: "MZ"
        },
        {
            quote: "Outstanding friction resistance under continuous thermal stress. Silkshine is our top lubricant partner.",
            author: "Bilal Chaudhry",
            role: "Plant Head, Crescent Mills",
            initials: "BC"
        },
        {
            quote: "Top tier refined quality. Fast delivery across regional hubs with clear electronic invoicing.",
            author: "Zubair Raza",
            role: "Supply Lead, Apex Freight",
            initials: "ZR"
        },
        {
            quote: "Smooth operations across all our heavy agricultural generators. Pure quality base stock.",
            author: "Tariq Farooq",
            role: "Agri Farm Operations",
            initials: "TF"
        }
    ];

    const processSteps = [
        {
            step: "01",
            title: "Base Stock Selection",
            desc: "Imported Group II & III virgin base stocks selected for maximum purity.",
            icon: Factory,
            highlights: ["Virgin Group II/III Stocks", "0% Recycled Impurities", "High Viscosity Index"]
        },
        {
            step: "02",
            title: "Additive Blending",
            desc: "Computer-controlled thermal vat mixing for exact formula consistency.",
            icon: Droplets,
            highlights: ["Automated Temperature Control", "Zinc & Phosphorus Fortified", "Zero Sludge Formation"]
        },
        {
            step: "03",
            title: "Micro Filtration",
            desc: "5-stage sub-micron impurity extraction guarantees perfection.",
            icon: ShieldCheck,
            highlights: ["5-Stage Sub-Micron Pass", "ISO 4406 Cleanliness Standard", "Laboratory Sample Verified"]
        },
        {
            step: "04",
            title: "Auto Packaging",
            desc: "Sealed automatically into bottles, cans, and industrial drums.",
            icon: Package,
            highlights: ["Induction Foil Sealed", "Barcoded Traceability", "Bulk Drum Ready"]
        }
    ];

    const getVisualStepIndex = (idx: number) => {
        if (idx <= 1) return 0;
        if (idx >= 4) return 3;
        return idx - 1;
    };

    const activeStepIndex = getVisualStepIndex(currentIndex);
    const activeStep = processSteps[activeStepIndex];

    useEffect(() => {
        const section = processSectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isProcessInViewRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.8;
            },
            { threshold: [0.8] }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const handleStepChange = (direction: 'next' | 'prev') => {
        if (isBusyRef.current) return false;

        const current = indexRef.current;
        const delta = direction === 'next' ? 1 : -1;
        const nextIndex = current + delta;

        if (nextIndex < 1 || nextIndex > 4) return false;

        isBusyRef.current = true;
        setCurrentIndex(nextIndex);
        setTimeout(() => { isBusyRef.current = false; }, 400);
        return true;
    };

    useEffect(() => {
        let touchStartY = 0;
        let touchCurrentY = 0;

        const onWheel = (e: WheelEvent) => {
            if (!isProcessInViewRef.current) return;

            const delta = e.deltaY > 0 ? 1 : -1;
            const current = indexRef.current;
            let isStepChangeRequired = false;
            let nextIndex = current;

            if (delta === 1 && current < 4) {
                isStepChangeRequired = true;
                nextIndex = current + 1;
            } else if (delta === -1 && current > 1) {
                isStepChangeRequired = true;
                nextIndex = current - 1;
            }

            if (isStepChangeRequired) {
                e.preventDefault();
                if (isBusyRef.current) return;

                isBusyRef.current = true;
                setCurrentIndex(nextIndex);
                setTimeout(() => { isBusyRef.current = false; }, 400);
            }
        };

        const onTouchStart = (e: TouchEvent) => {
            if (!isProcessInViewRef.current) return;
            touchStartY = e.touches[0].clientY;
            touchCurrentY = touchStartY;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!isProcessInViewRef.current) return;

            touchCurrentY = e.touches[0].clientY;
            const deltaY = touchStartY - touchCurrentY;
            const current = indexRef.current;

            // If dragging up (scrolling down) & can go next, OR dragging down (scrolling up) & can go prev
            if ((deltaY > 0 && current < 4) || (deltaY < 0 && current > 1)) {

                e.preventDefault(); // Stop native page scrolling

                // Trigger step change if swipe distance exceeds 50px
                if (Math.abs(deltaY) > 50) {
                    if (isBusyRef.current) return;

                    const nextIndex = deltaY > 0 ? current + 1 : current - 1;
                    isBusyRef.current = true;
                    setCurrentIndex(nextIndex);

                    // Reset anchor point to require a fresh drag distance for the next step
                    touchStartY = touchCurrentY;

                    setTimeout(() => { isBusyRef.current = false; }, 400);
                }
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (!isProcessInViewRef.current) return;

            let delta = 0;
            if (['ArrowDown', 'PageDown'].includes(e.code)) delta = 1;
            if (['ArrowUp', 'PageUp'].includes(e.code)) delta = -1;

            if (delta === 0) return;

            const nextIndex = indexRef.current + delta;
            if (nextIndex < 1 || nextIndex > 4) return;

            e.preventDefault();
            if (isBusyRef.current) return;

            isBusyRef.current = true;
            setCurrentIndex(nextIndex);
            setTimeout(() => { isBusyRef.current = false; }, 400);
        };

        // Applied to window to ensure we catch all scroll/swipe actions globally when section is in view
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
        };
    }, []);

    return (
        <div ref={mainContainerRef} className="w-full h-screen overflow-y-auto md:snap-y md:snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* 1. HERO SECTION */}
            <section className="min-h-[100dvh] lg:h-screen w-full md:snap-start md:snap-always relative flex flex-col justify-between bg-gradient-to-b from-amber-50/40 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-12 overflow-hidden">
                <Navbar />

                <div className="container px-5 md:px-16 lg:px-24 mx-auto flex-grow flex items-center py-10 lg:py-0">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
                        <div className="text-left space-y-6 max-w-2xl mt-4 md:mt-0">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <Sparkles className="w-4 h-4" /> High Precision Industrial & Engine Lubricants
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                                {t('heroTitle')}
                            </h1>
                            <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                                {t('heroSubtitle')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="w-full sm:w-auto justify-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-4 px-9 rounded-2xl text-base transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 hover:scale-[1.02]"
                                >
                                    {t('shopCollection')} <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="w-full sm:w-auto justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold py-4 px-9 rounded-2xl text-base transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {t('story')}
                                </button>
                            </div>
                        </div>

                        <div className="relative hidden md:flex justify-center items-center py-12 px-4 group rounded-3xl">
                            {/* Amber Glow Backdrop */}
                            {/* <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-amber-400/25 to-yellow-300/15 rounded-full blur-3xl -z-10 animate-pulse"></div> */}

                            {/* Product Image */}
                            <div className="relative z-10 transition-all duration-300 ease-out group-hover:-translate-y-2">
                                <img
                                    src={bottleShot}
                                    alt="SilkShine Product"
                                    className="w-4/5 sm:w-full max-w-[300px] sm:max-w-md lg:max-w-lg object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:scale-[110%]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-5 md:px-16 lg:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/80 dark:border-gray-800 p-4 md:p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{t('organic')}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('directOrganic')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 border-y md:border-y-0 md:border-x border-gray-200 dark:border-gray-800 py-4 md:py-0 md:px-6">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{t('labTested')}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('certifiedPurity')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{t('fastDelivery')}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('freeShipping')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. PROCESS SECTION */}
            <section
                id="process"
                ref={processSectionRef}
                className="min-h-[100dvh] lg:h-screen w-full md:snap-start md:snap-always relative flex flex-col justify-between bg-gray-50 dark:bg-gray-950 px-5 md:px-16 lg:px-24 py-16 md:py-10 overflow-hidden"
            >
                <div className="container gap-6 md:gap-5 mx-auto max-w-6xl flex flex-col h-full justify-center lg:justify-between items-center">
                    <div className="text-center space-y-2 max-w-2xl">
                        <span className="text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase text-xs">
                            Manufacturing Excellence
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            The SilkShine Process
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
                            Engineered through 4 automated stages for maximum thermal stability and purity.
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 my-4 md:my-2 w-full overflow-x-auto pb-2 md:pb-0">
                        {processSteps.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx + 1)}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === activeStepIndex
                                        ? 'w-12 bg-amber-500'
                                        : 'w-3 bg-gray-300 dark:bg-gray-700'
                                    }`}
                                aria-label={`Go to step ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <div className="w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-2xl overflow-hidden flex-grow flex flex-col max-h-none lg:max-h-[580px] my-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 h-full w-full">
                            <div className="lg:col-span-7 bg-slate-950 relative overflow-hidden flex items-center justify-center group min-h-[260px] lg:min-h-full">
                                <div className="absolute -inset-10 bg-gradient-to-r from-amber-500/20 to-transparent blur-3xl opacity-40 group-hover:opacity-75 transition-opacity duration-700"></div>

                                <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                                    <span className="bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg tracking-wider uppercase">
                                        Stage {activeStep.step} / 04
                                    </span>
                                    <span className="hidden sm:inline-block bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/20 text-[11px] font-semibold px-3 py-1 rounded-xl">
                                        HD Process Stream
                                    </span>
                                </div>

                                <div className="relative z-10 flex flex-col items-center gap-3">
                                    <button className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30 transition-all duration-300 transform hover:scale-110 active:scale-95">
                                        <Play className="w-6 h-6 md:w-8 md:h-8 ml-1 fill-current" />
                                    </button>
                                    <span className="text-[10px] md:text-xs text-amber-200/80 font-medium tracking-wide">
                                        Click to watch operational video
                                    </span>
                                </div>
                            </div>

                            <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between bg-gradient-to-b from-transparent via-gray-50/50 to-gray-100/50 dark:via-gray-900/50 dark:to-gray-950/50 h-full">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20">
                                            <activeStep.icon className="w-6 h-6 md:w-7 md:h-7" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] md:text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-0.5">
                                                Active Stage
                                            </span>
                                            <h3 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                                {activeStep.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed font-normal">
                                        {activeStep.desc}
                                    </p>

                                    <div className="space-y-3 pt-4 border-t border-gray-200/60 dark:border-gray-800">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                            Key Specifications
                                        </h4>
                                        {activeStep.highlights.map((point, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs md:text-sm text-gray-800 dark:text-gray-200 font-semibold">
                                                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                </div>
                                                <span>{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200/60 dark:border-gray-800">
                                    <button
                                        onClick={() => handleStepChange('prev')}
                                        disabled={activeStepIndex === 0}
                                        className="flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 disabled:opacity-20 font-bold text-xs transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Previous</span>
                                    </button>

                                    <span className="text-xs font-extrabold text-gray-400 tracking-wider">
                                        0{activeStepIndex + 1} / 0{processSteps.length}
                                    </span>

                                    <button
                                        onClick={() => handleStepChange('next')}
                                        disabled={activeStepIndex === processSteps.length - 1}
                                        className="flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 disabled:opacity-20 font-bold text-xs transition-all"
                                    >
                                        <span className="hidden sm:inline">Next</span> <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. BEST SELLERS SECTION */}
            <section className="min-h-[100dvh] lg:h-screen w-full md:snap-start md:snap-always relative flex flex-col justify-center bg-white dark:bg-gray-900 px-5 md:px-16 lg:px-24 py-20 lg:py-12">
                <div className="container mx-auto">
                    <div className="text-center mb-10 space-y-2">
                        <span className="text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase text-xs">{t('shopCollection')}</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('bestSellers')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white dark:bg-gray-950 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col shadow-sm hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300"
                            >
                                <div className="h-48 relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 border-b border-gray-100 dark:border-gray-800">
                                    <span className="absolute top-3 left-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/20">
                                        Best Seller
                                    </span>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="bg-white text-gray-900 p-2.5 rounded-full hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow justify-between">
                                    <div>
                                        <div className="flex items-center gap-1 mb-1 text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                                            ))}
                                            <span className="text-[10px] text-gray-400 font-medium ml-1">({product.rating})</span>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">{product.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <span className="text-[10px] text-gray-400 block font-medium">Price</span>
                                            <span className="text-lg font-black text-gray-900 dark:text-white">Rs. {product.price.toLocaleString()}</span>
                                        </div>
                                        <button
                                            onClick={() => addToCart(product, product.sizes[0])}
                                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-[1.02]"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" /> {t('addToCart')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link to="/products" className="inline-block border-2 border-slate-950 dark:border-white text-slate-950 dark:text-white px-8 py-3 rounded-xl font-bold text-xs hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all">
                            {t('viewAllProducts')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. REVIEWS SECTION & FOOTER */}
            <section className="min-h-[100dvh] w-full md:snap-start md:snap-always relative flex flex-col justify-between bg-gray-50 dark:bg-gray-950 pt-20">
                <div className="container mx-auto px-5 md:px-16 lg:px-24 pb-12 flex-grow flex flex-col justify-center">
                    <div className="text-center mb-10 space-y-2">
                        <span className="text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase text-xs">Testimonials</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Trusted by Industry Leaders</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:px-12">
                        {reviews.map((rev, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-900 p-5 md:p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800 flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex text-amber-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                                        </div>
                                        <Quote className="w-5 h-5 text-amber-500/20" />
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed mb-4 italic">
                                        "{rev.quote}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div className="w-9 h-9 bg-amber-500/10 rounded-full flex items-center justify-center font-bold text-amber-600 text-xs shrink-0">
                                        {rev.initials}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs text-gray-900 dark:text-white">{rev.author}</h4>
                                        <p className="text-[10px] text-gray-500">{rev.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Footer />
            </section>
        </div>
    );
};

export default Home;