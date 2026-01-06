
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { DELIVERY_CHARGES } from '../constants/products';
import { Minus, Plus, Trash2, CheckCircle, CreditCard, Banknote, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useApp();
    const { t } = useLanguage();
    const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);

    const finalTotal = cartTotal + DELIVERY_CHARGES - discount;

    const handleApplyCoupon = () => {
        if (coupon.toLowerCase() === 'shine10') {
            setDiscount(cartTotal * 0.1); // 10% off
        }
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setStep('success');
            clearCart();
        }, 1500);
    };

    if (step === 'success') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    Thank you for choosing SilkShine. Your order has been confirmed and will be shipped to {formData.address}.
                </p>
                <Link to="/" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
                    {t('browseProducts')}
                </Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">{t('yourCart')}</h1>
                <p className="text-gray-500 mb-8">{t('emptyCart')}</p>
                <Link to="/products" className="text-yellow-600 hover:text-yellow-700 font-bold underline">
                    {t('browseProducts')}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up">
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => setStep('cart')}
                    className={`flex items-center gap-2 ${step === 'cart' ? 'text-black dark:text-white font-bold' : 'text-gray-400 dark:text-gray-500'}`}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'cart' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' : 'border-gray-300 dark:border-gray-600'}`}>1</div>
                    <span>{t('yourCart')}</span>
                </button>
                <div className="h-px bg-gray-200 dark:bg-gray-700 w-12"></div>
                <div className={`flex items-center gap-2 ${step === 'details' ? 'text-black dark:text-white font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'details' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' : 'border-gray-300 dark:border-gray-600'}`}>2</div>
                    <span>{t('shipping')}</span>
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-8 dark:text-white">{step === 'cart' ? t('yourCart') : t('delivery')}</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content Area (Switches based on step) */}
                <div className="md:col-span-2 space-y-6">

                    {/* STEP 1: CART ITEMS */}
                    {step === 'cart' && (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                    <div className="shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg dark:text-white">{item.name}</h4>
                                                <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">{item.selectedSize}</div>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-xl dark:text-white text-gray-900">${item.price}</span>
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1.5 border border-gray-200 dark:border-gray-600">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, Math.max(0, item.quantity - 1))}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded-md shadow-sm transition-all"
                                                >
                                                    <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                                </button>
                                                <span className="text-base font-medium w-6 text-center dark:text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded-md shadow-sm transition-all"
                                                >
                                                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 2: DETAILS FORM */}
                    {step === 'details' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-2 rounded-lg"><Truck className="w-5 h-5" /></span>
                                    {t('delivery')}
                                </h2>
                                <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fullName')}</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('address')}</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('city')}</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('phone')}</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-2 rounded-lg"><CreditCard className="w-5 h-5" /></span>
                                    {t('paymentMethod')}
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'card' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-100 shadow-md' : 'border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 dark:text-gray-300'}`}
                                    >
                                        <CreditCard className="w-8 h-8 mb-3" />
                                        <span className="font-bold">{t('card')}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-100 shadow-md' : 'border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 dark:text-gray-300'}`}
                                    >
                                        <Banknote className="w-8 h-8 mb-3" />
                                        <span className="font-bold">{t('cashOnDelivery')}</span>
                                    </button>
                                </div>
                            </div>

                            <button onClick={() => setStep('cart')} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-medium underline flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Cart
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary (Always Visible but content varies) */}
                <div className="space-y-6">
                    <div className="bg-gray-50 border-2 border-gray-100 shadow-lg dark:bg-gray-800 p-6 rounded-3xl sticky top-24 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-6 dark:text-white">{t('summary')}</h2>

                        {/* Compact List for Step 2 */}
                        {step === 'details' && (
                            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="flex-grow">
                                            <div className="text-sm font-bold dark:text-white line-clamp-1">{item.name}</div>
                                            <div className="text-xs text-gray-500">x{item.quantity} ({item.selectedSize})</div>
                                        </div>
                                        <div className="text-sm font-bold dark:text-white">${item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>{t('subtotal')}</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>{t('delivery')}</span>
                                <span>${DELIVERY_CHARGES.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>{t('discount')}</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 dark:text-white">
                                <span>{t('total')}</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Coupon - Only in Step 1 */}
                        {step === 'cart' && (
                            <div className="mt-6">
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder={t('couponCode')}
                                        className="flex-grow px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-yellow-500"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                                    >
                                        {t('apply')}
                                    </button>
                                </div>
                                {discount > 0 && <div className="text-green-600 text-xs mb-4">Coupon applied successfully!</div>}

                                <button
                                    onClick={() => setStep('details')}
                                    className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-200 dark:shadow-yellow-900 flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Place Order - Only in Step 2 */}
                        {step === 'details' && (
                            <button
                                form="checkout-form"
                                type="submit"
                                className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl mt-6 hover:opacity-90 transition-opacity shadow-lg"
                            >
                                {t('placeOrder')} (${finalTotal.toFixed(2)})
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
