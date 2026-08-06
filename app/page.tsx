'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/constants/products';
import { useApp } from '@/lib/context/AppContext';
import { useLanguage } from '@/lib/context/LanguageContext';

import {
    ArrowRight, Leaf, ShieldCheck, Star, Truck, Factory,
    Droplets, Package, Quote, Sparkles, Eye, ShoppingCart,
    ChevronLeft, ChevronRight, CheckCircle2
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/NavBar';

interface ProcessStep {
    step: string | number;
    title: string;
    desc: string;
    icon: any;
    videoUrl: string;
    highlights: string[];
}

// Helper to detect and convert YouTube links to embed format
const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
        ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}`
        : url;
};

const isYouTubeUrl = (url: string) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
};

export default function HomePage() {
    const { addToCart } = useApp();
    const { t, language } = useLanguage();
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(1);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Array<{ quote: string; author: string; role: string; initials: string; rating?: number }>>([]);

    // Dynamic process steps state
    const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isBusyRef = useRef(false);

    // Default fallback steps if none exist in settings
    const defaultSteps: ProcessStep[] = [
        {
            step: "01",
            title: "Seed Crushing & Extraction",
            desc: "Raw organic seeds are precision-crushed to extract pure, high-grade natural oils.",
            icon: Factory,
            videoUrl: "",
            highlights: ["Precision Seed Pressing", "Pure Organic Extraction", "Zero Impurities"]
        },
        {
            step: "02",
            title: "Measured Grinder Blending",
            desc: "Extracted oils are weighted and blended in automated grinders to exact specifications.",
            icon: Droplets,
            videoUrl: "",
            highlights: ["Automated Weight Scaling", "Thermal Vat Mixing", "Exact Formulation"]
        },
        {
            step: "03",
            title: "Bottling & Labeling",
            desc: "Sterile automated lines precisely fill, cap, and label custom dropper bottles.",
            icon: Package,
            videoUrl: "",
            highlights: ["Sterile Conveyor Line", "Automatic Sticker Labeling", "Airtight Sealing"]
        }
    ];

    useEffect(() => {
        let isMounted = true;

        const loadHomeData = async () => {
            try {
                setLoading(true);
                const [productsRes, reviewsRes, settingsRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/reviews'),
                    fetch('/api/site-metadata').catch(() => null),
                ]);

                if (!productsRes.ok || !reviewsRes.ok) {
                    throw new Error('Failed to load storefront data');
                }

                const productsData = await productsRes.json();
                const reviewsData = await reviewsRes.json();

                let settingsData: any = {};
                if (settingsRes && settingsRes.ok) {
                    settingsData = await settingsRes.json();
                }

                if (!isMounted) return;

                setFeaturedProducts(Array.isArray(productsData) ? productsData.slice(0, 3) : []);
                setReviews(Array.isArray(reviewsData) ? reviewsData : []);

                // Parse processSteps from database settings if available, else fallback to default 3 steps
                const fetchedSteps = settingsData?.processSteps || settingsData?.processsteps;
                if (Array.isArray(fetchedSteps) && fetchedSteps.length > 0) {
                    const formattedSteps: ProcessStep[] = fetchedSteps.map((item: any, idx: number) => {
                        const titleText = typeof item.title === 'object' && item.title !== null
                            ? (item.title[language] || item.title.en || 'Process Step')
                            : (item.title || `Stage 0${idx + 1}`);

                        const descText = typeof item.description === 'object' && item.description !== null
                            ? (item.description[language] || item.description.en || '')
                            : (item.description || item.Descriptipn || '');

                        return {
                            step: item.step ? String(item.step).padStart(2, '0') : String(idx + 1).padStart(2, '0'),
                            title: titleText,
                            desc: descText,
                            icon: idx === 0 ? Factory : idx === 1 ? Droplets : Package,
                            videoUrl: item.videoUrl || '',
                            highlights: Array.isArray(item.keySpecs) ? item.keySpecs : ["Precision Standards", "Automated Quality Control", "Pure Processing"]
                        };
                    });
                    setProcessSteps(formattedSteps);
                } else {
                    setProcessSteps(defaultSteps);
                }

                setError('');
            } catch (err) {
                if (!isMounted) return;
                setError(err instanceof Error ? err.message : 'Unable to load homepage data');
                setProcessSteps(defaultSteps);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadHomeData();

        return () => {
            isMounted = false;
        };
    }, [language]);

    const getVisualStepIndex = (idx: number) => {
        const total = processSteps.length > 0 ? processSteps.length : 3;
        if (idx <= 1) return 0;
        if (idx >= total) return total - 1;
        return idx - 1;
    };

    const activeStepIndex = getVisualStepIndex(currentIndex);
    const activeStep = processSteps[activeStepIndex] || defaultSteps[0];

    const handleStepChange = (direction: 'next' | 'prev') => {
        if (isBusyRef.current) return;

        const delta = direction === 'next' ? 1 : -1;
        const nextIndex = currentIndex + delta;
        const totalSteps = processSteps.length > 0 ? processSteps.length : 3;

        if (nextIndex < 1 || nextIndex > totalSteps) return;

        isBusyRef.current = true;
        setCurrentIndex(nextIndex);
        setTimeout(() => { isBusyRef.current = false; }, 300);
    };

    const [activeDiscount, setActiveDiscount] = useState<{ title: string; code: string; discountPercentage: number } | null>(null);
    const [copiedCode, setCopiedCode] = useState(false);

    useEffect(() => {
        fetch('/api/discounts?activeOnly=true')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.code && data?.isActive !== false) {
                    setActiveDiscount(data);
                }
            })
            .catch((err) => console.error('Error fetching active discount event:', err));
    }, []);

    const [isLoaded, setIsLoaded] = useState(false);

    useLayoutEffect(() => {
        // Fires instantly on load
        setIsLoaded(true);
    }, []);

    return (
        <div className="w-full  h-screen overflow-y-auto md:snap-y md:snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">



            {/* 1. HERO SECTION */}
            <section className="min-h-[100dvh] lg:h-screen w-full md:snap-start md:snap-always relative flex flex-col justify-between bg-gradient-to-b from-amber-50/40 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-12">
                <Navbar />
                {/* Dynamic Active Discount Promo Banner (Requirement 7) */}
                {activeDiscount && (
                    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-black py-2 px-4 z-50 text-center text-xs md:text-sm font-bold shadow-sm flex items-center justify-center gap-2 flex-wrap sticky top-0">
                        <Sparkles className="w-4 h-4 animate-bounce" />
                        <span>🎉 {activeDiscount.title} — Get {activeDiscount.discountPercentage}% OFF with promo code:</span>
                        <span className="bg-black text-amber-400 px-2.5 py-0.5 rounded font-mono uppercase tracking-wider text-xs font-black">{activeDiscount.code}</span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(activeDiscount.code);
                                setCopiedCode(true);
                                setTimeout(() => setCopiedCode(false), 2500);
                            }}
                            className="ml-1 px-2.5 py-0.5 bg-white text-black hover:bg-gray-100 rounded text-xs transition-colors shadow-sm font-semibold"
                        >
                            {copiedCode ? 'Copied! ✓' : 'Copy Code'}
                        </button>
                    </div>
                )}

                <div className="container px-5 md:px-16 lg:px-24 mx-auto flex-grow flex items-center py-10 lg:py-0">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
                        <div className="relative flex flex-col justify-center items-center py-2 px-4 group rounded-3xl overflow-hidden">
                            {/* Welcome Text: Animates instantly with zero delay */}
                            <div className={`mb-6 text-center transition-all duration-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                                <span className="inline-block text-[14px] sm:text-sm uppercase tracking-[0.3em] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-5 py-2 rounded-full border border-amber-200/50 dark:border-amber-800/50 shadow-sm transition-transform duration-300 hover:scale-105">
                                    Welcome to SilkShine
                                </span>
                            </div>

                            {/* Logo Image: Follows almost instantly (delay-75 instead of delay-150 or 300) */}
                            <div className={`relative z-10 transition-all duration-500 delay-0 transform ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                                <img
                                    src="/assets/mainlogo.jpeg"
                                    alt="SilkShine Product"
                                    className="w-4/5 sm:w-full max-w-[300px] sm:max-w-md lg:max-w-lg object-contain rounded-2xl transition-transform duration-300 hover:scale-105 hover:-translate-y-1 active:scale-110"
                                />
                            </div>
                        </div>
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
                                    onClick={() => router.push('/products')}
                                    className="w-full sm:w-auto justify-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-4 px-9 rounded-2xl text-base transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 hover:scale-[1.02]"
                                >
                                    {t('shopCollection')} <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => router.push('/about')}
                                    className="w-full sm:w-auto justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold py-4 px-9 rounded-2xl text-base transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {t('story')}
                                </button>
                            </div>
                        </div>

                        <div className="relative hidden md:flex justify-center items-center py-12 px-4 group rounded-3xl">
                            {/* <div className="relative z-10">
                                <img
                                    src="/assets/mainlogo.jpeg"
                                    alt="SilkShine Product"
                                    className="w-4/5 sm:w-full max-w-[300px] sm:max-w-md lg:max-w-lg object-contain  animate-pulse"
                                />
                            </div> */}
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

            {/* 2. DYNAMIC VIDEO PROCESS SECTION */}
            <section
                id="process"
                className="min-h-[100dvh] lg:h-screen w-full md:snap-start md:snap-always relative flex flex-col justify-center bg-gray-50 dark:bg-gray-950 px-5 md:px-16 lg:px-24 py-16"
            >
                <div className="container gap-6 mx-auto max-w-6xl flex flex-col justify-center items-center">
                    <div className="text-center space-y-2 max-w-2xl">
                        <span className="text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase text-xs">
                            Manufacturing Excellence
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            The SilkShine Process
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
                            Engineered through automated stages for maximum purity and quality.
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 my-4 w-full">
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

                    <div className="w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-2xl overflow-hidden flex flex-col">
                        <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
                            <div className="lg:col-span-7 bg-slate-950 relative overflow-hidden flex items-center justify-center group min-h-[220px] lg:min-h-[420px]">
                                <div className="absolute -inset-10 bg-gradient-to-r from-amber-500/20 to-transparent blur-3xl opacity-40 group-hover:opacity-75 transition-opacity duration-700"></div>

                                <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                                    <span className="bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg tracking-wider uppercase">
                                        Stage {activeStep.step} / {String(processSteps.length).padStart(2, '0')}
                                    </span>
                                </div>

                                {activeStep.videoUrl ? (
                                    isYouTubeUrl(activeStep.videoUrl) ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(activeStep.videoUrl)}
                                            title={activeStep.title}
                                            className="w-full h-full border-0 relative z-10 min-h-[220px] lg:min-h-[420px] pointer-events-none"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    ) : (
                                        <video
                                            key={activeStep.videoUrl}
                                            src={activeStep.videoUrl}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover relative z-10 min-h-[220px] lg:min-h-[420px]"
                                        />
                                    )
                                ) : (
                                    <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
                                        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400">
                                            <Factory className="w-7 h-7" />
                                        </div>
                                        <span className="text-xs text-amber-200/80 font-medium tracking-wide">
                                            Video link pending upload in admin panel metadata
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-b from-transparent via-gray-50/50 to-gray-100/50 dark:via-gray-900/50 dark:to-gray-950/50">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20">
                                            <Factory className="w-6 h-6 md:w-7 md:h-7" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] md:text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-0.5">
                                                Active Stage
                                            </span>
                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                                {activeStep.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed font-normal">
                                        {activeStep.desc}
                                    </p>

                                    <div className="space-y-2 pt-2 border-t border-gray-200/60 dark:border-gray-800">
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

                                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200/60 dark:border-gray-800">
                                    <button
                                        onClick={() => handleStepChange('prev')}
                                        disabled={activeStepIndex === 0}
                                        className="flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 disabled:opacity-20 font-bold text-xs transition-all cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Previous</span>
                                    </button>

                                    <span className="text-xs font-extrabold text-gray-400 tracking-wider">
                                        0{activeStepIndex + 1} / 0{processSteps.length}
                                    </span>

                                    <button
                                        onClick={() => handleStepChange('next')}
                                        disabled={activeStepIndex === processSteps.length - 1}
                                        className="flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 disabled:opacity-20 font-bold text-xs transition-all cursor-pointer"
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
            <section className="min-h-[100dvh] lg:h-screen w-full md:snap-start md:snap-always relative flex flex-col justify-center bg-white dark:bg-gray-900 px-5 md:px-16 lg:px-24 py-20">
                <div className="container mx-auto">
                    <div className="text-center mb-10 space-y-2">
                        <span className="text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase text-xs">{t('shopCollection')}</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('bestSellers')}</h2>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
                            {[...Array(3)].map((_, idx) => (
                                <div key={idx} className="animate-pulse rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
                                    <div className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800 mb-4" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-3" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-2" />
                                    <div className="h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl mt-4" />
                                </div>
                            ))}
                        </div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="mb-8 rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                            No featured products are available right now.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
                            {featuredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white dark:bg-gray-950 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col shadow-sm hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300"
                                >
                                    <Link
                                        href={`/product/${product.id}`}
                                        title="View Details"
                                    >
                                        <div className="h-48 relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 border-b border-gray-100 dark:border-gray-800">
                                            <span className="absolute top-3 left-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/20">
                                                Best Seller
                                            </span>
                                            <img
                                                src={typeof product.image === 'string' ? product.image : (product.image as any)?.src}
                                                alt={product.name}
                                                className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                                            />
                                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                <Eye className="w-4 h-4 text-white" />
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
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addToCart(product, product.sizes[0]);
                                                    }}
                                                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-[1.02]"
                                                >
                                                    <ShoppingCart className="w-3.5 h-3.5" /> {t('addToCart')}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center">
                        <Link href="/products" className="inline-block border-2 border-slate-950 dark:border-white text-slate-950 dark:text-white px-8 py-3 rounded-xl font-bold text-xs hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all">
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

                    {reviews.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                            No testimonials are available at the moment.
                        </div>
                    ) : (
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
                    )}
                </div>

                <Footer />
            </section>
        </div>
    );
}