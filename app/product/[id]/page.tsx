'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Star, Truck, ShieldCheck, ShoppingBag, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { PRODUCT_DETAILS_CONTENT } from '@/constants/content';

import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { addToCart } = useApp();
    const { t, language } = useLanguage();

    const tp = (obj: any) => obj[language] || obj['en'];

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [activeImage, setActiveImage] = useState(0);

    // Review form state
    const [reviewUser, setReviewUser] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/products/${id}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                setProduct(data);
                if (data?.sizes?.[0]) setSelectedSize(data.sizes[0]);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const getImageSrc = (img: any) => (typeof img === 'string' ? img : img?.src);

    const handleBuyNow = () => {
        if (!product) return;
        const sizeToUse = selectedSize || product.sizes?.[0] || 'Standard';
        addToCart(product, sizeToUse);
        router.push('/cart');
    };

    const handleAddToCart = () => {
        if (!product) return;
        const sizeToUse = selectedSize || product.sizes?.[0] || 'Standard';
        addToCart(product, sizeToUse);
        router.push('/cart');
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setSubmittingReview(true);
        setReviewError('');
        setReviewSuccess('');

        try {
            const lookupId = product.id || product._id;
            const res = await fetch(`/api/products/${lookupId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: reviewUser,
                    rating: reviewRating,
                    comment: reviewComment,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to submit review');

            setReviewSuccess('Thank you! Your review has been submitted successfully.');
            setReviewUser('');
            setReviewRating(5);
            setReviewComment('');

            if (data.product) {
                setProduct(data.product);
            }
        } catch (err) {
            setReviewError(err instanceof Error ? err.message : 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const dynamicFeatures: string[] =
        Array.isArray(product?.features) && product.features.length > 0
            ? product.features
            : PRODUCT_DETAILS_CONTENT.features.map((f) => tp(f));

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950">
            <Navbar />

            <div className="flex-grow pb-16">
                {loading ? (
                    <div className="container mx-auto px-4 py-16 max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
                            <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl" />
                            <div className="space-y-4 pt-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                                <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded" />
                                <div className="h-12 bg-amber-200 dark:bg-amber-900 rounded-2xl w-full" />
                            </div>
                        </div>
                    </div>
                ) : !product ? (
                    <div className="container mx-auto px-4 py-32 text-center space-y-6">
                        <h2 className="text-4xl font-bold dark:text-white">Product not found</h2>
                        <button
                            onClick={() => router.push('/products')}
                            className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all"
                        >
                            Back to Products
                        </button>
                    </div>
                ) : (
                    <div className="container mx-auto px-4 py-8 animate-fade-in-up max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-10">
                            {/* Product Images */}
                            <div className="space-y-4">
                                <div className="max-h-[500px] aspect-square bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden relative group shadow-lg border border-gray-100 dark:border-gray-800">
                                    <img
                                        src={getImageSrc(([product.image, ...(product.images || [])])[activeImage] || product.image)}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                {(product.images && product.images.length > 0) && (
                                    <div className="flex w-fit gap-3 p-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-700">
                                        {[product.image, ...(product.images || [])].map((img: any, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveImage(index)}
                                                className={`flex h-20 w-20 aspect-square rounded-xl overflow-hidden border transition-all duration-300 ${activeImage === index
                                                    ? 'border-yellow-500 scale-95 ring-2 ring-yellow-500/10'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={getImageSrc(img)} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Info & Actions */}
                            <div className="flex flex-col justify-center space-y-6">
                                <div className="space-y-1">
                                    <div className="text-yellow-600 dark:text-yellow-400 font-bold tracking-widest uppercase text-xs">
                                        {t('shopCollection')}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-3 pt-1">
                                        <div className="flex text-yellow-500 scale-90">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(product.rating || 5)
                                                        ? 'fill-current'
                                                        : 'text-gray-200 dark:text-gray-700'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                                            {product.rating || 5.0} ({product.reviews || 0} {t('reviews')})
                                        </span>
                                    </div>
                                </div>

                                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg font-light italic">
                                    "{product.description}"
                                </p>

                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-base">Choose your size</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {product.sizes.map((size: string) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-6 py-2.5 rounded-xl border-2 font-bold transition-all duration-300 text-sm ${selectedSize === size
                                                        ? 'border-yellow-500 bg-yellow-500 text-black shadow-md'
                                                        : 'border-gray-100 dark:border-gray-800 hover:border-yellow-200 dark:hover:border-yellow-900 dark:text-gray-300'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-5">
                                    <div className="flex items-end gap-3">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            PKR {Number(product.price).toLocaleString()}
                                        </span>
                                        {product.oldPrice && product.oldPrice > product.price && (
                                            <span className="text-gray-400 text-base line-through mb-1">
                                                PKR {Number(product.oldPrice).toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons: Add to Cart & Buy Now */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-black dark:bg-yellow-500 text-white dark:text-black px-6 py-3.5 rounded-2xl font-bold hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            <span>{t('addToCart')}</span>
                                        </button>

                                        {/* Requirement 5: Buy Now Button */}
                                        <button
                                            onClick={handleBuyNow}
                                            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-amber-200 dark:shadow-amber-900/40 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <span>⚡ Buy Now</span>
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
                                            <span className="font-bold">{t('labTested')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Features Grid (Requirement 4) */}
                        <div className="mt-12 space-y-12">
                            <div className="bg-gray-50/50 dark:bg-gray-900/20 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl md:text-2xl font-bold mb-6 dark:text-white text-center">
                                    {language === 'en' ? 'Product Features' : 'مصنوعات کی خصوصیات'}
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {dynamicFeatures.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 p-3.5 bg-white dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:border-yellow-500/30"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-snug">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Reviews & Feedback System (Requirement 6) */}
                            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                                            <MessageSquare className="w-6 h-6 text-amber-500" />
                                            <span>Customer Reviews & Feedback</span>
                                        </h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Real feedback from verified purchasers</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 rounded-2xl border border-amber-200 dark:border-amber-900">
                                        <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{product.rating || 5.0}</span>
                                        <div>
                                            <div className="flex text-amber-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{product.reviews || 0} Verified Reviews</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Review List Grid */}
                                <div className="space-y-4">
                                    {(!product.reviewsList || product.reviewsList.length === 0) ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">Be the first customer to leave a review for this product!</p>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {product.reviewsList.map((rev: any, idx: number) => (
                                                <div key={rev._id || idx} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/60 space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-gray-900 dark:text-white text-sm">{rev.user}</span>
                                                        <span className="text-[11px] text-gray-400">{new Date(rev.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex text-amber-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light italic">"{rev.comment}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Write a Review Form */}
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
                                    <h3 className="text-lg font-bold dark:text-white">Write a Review</h3>

                                    {reviewSuccess && (
                                        <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-800 dark:text-green-200 rounded-xl text-sm flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            <span>{reviewSuccess}</span>
                                        </div>
                                    )}

                                    {reviewError && (
                                        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 rounded-xl text-sm">
                                            {reviewError}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmitReview} className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Sarah Khan"
                                                value={reviewUser}
                                                onChange={(e) => setReviewUser(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1 to 5 Stars) *</label>
                                            <div className="flex items-center gap-2 pt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setReviewRating(star)}
                                                        className="p-1 hover:scale-110 transition-transform"
                                                    >
                                                        <Star
                                                            className={`w-6 h-6 ${star <= reviewRating
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'text-gray-300 dark:text-gray-700'
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                                <span className="text-xs font-bold ml-2 text-gray-600 dark:text-gray-400">{reviewRating} Stars</span>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Your Feedback & Experience *</label>
                                            <textarea
                                                required
                                                rows={3}
                                                placeholder="Write your honest thoughts about this product..."
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div className="md:col-span-2 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={submittingReview}
                                                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-60"
                                            >
                                                <Send className="w-4 h-4" />
                                                <span>{submittingReview ? 'Submitting Review...' : 'Submit Review'}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
