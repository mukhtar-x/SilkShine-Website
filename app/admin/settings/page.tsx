'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Percent, Truck, Plus, Trash2, CheckCircle2, X, Tag } from 'lucide-react';

type DiscountEvent = {
    _id: string;
    title: string;
    code: string;
    discountPercentage: number;
    isActive: boolean;
    applicableProducts?: number[];
};

type AdminProduct = {
    _id: string;
    id: string;
    numericId?: number;
    name: string;
};

export default function AdminSettingsPage() {
    // Settings state
    const [deliveryCharge, setDeliveryCharge] = useState<number>(500);
    const [taxRate, setTaxRate] = useState<number>(0);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);
    const [settingsSuccess, setSettingsSuccess] = useState('');
    const [settingsError, setSettingsError] = useState('');

    // Discount Events state
    const [discounts, setDiscounts] = useState<DiscountEvent[]>([]);
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loadingDiscounts, setLoadingDiscounts] = useState(true);
    const [discountError, setDiscountError] = useState('');
    const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false);
    const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null);

    const [discountForm, setDiscountForm] = useState({
        title: '',
        code: '',
        discountPercentage: '10',
        isActive: true,
        applicableProducts: [] as number[],
    });
    const [savingDiscount, setSavingDiscount] = useState(false);

    const loadSettings = async () => {
        try {
            setLoadingSettings(true);
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to load settings');
            setDeliveryCharge(data.deliveryCharge ?? 500);
            setTaxRate(data.taxRate ?? 0);
        } catch (err) {
            setSettingsError(err instanceof Error ? err.message : 'Failed to load settings');
        } finally {
            setLoadingSettings(false);
        }
    };

    const loadDiscounts = async () => {
        try {
            setLoadingDiscounts(true);
            const res = await fetch('/api/discounts');
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to load discount events');
            setDiscounts(Array.isArray(data) ? data : []);
        } catch (err) {
            setDiscountError(err instanceof Error ? err.message : 'Failed to load discount events');
        } finally {
            setLoadingDiscounts(false);
        }
    };

    const loadProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setProducts(data);
            }
        } catch (err) {
            console.error('Error fetching products for discount selection:', err);
        }
    };

    useEffect(() => {
        loadSettings();
        loadDiscounts();
        loadProducts();
    }, []);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true);
        setSettingsError('');
        setSettingsSuccess('');

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deliveryCharge, taxRate }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to update settings');

            setSettingsSuccess('Global store settings updated successfully!');
            setTimeout(() => setSettingsSuccess(''), 4000);
        } catch (err) {
            setSettingsError(err instanceof Error ? err.message : 'Failed to save settings');
        } finally {
            setSavingSettings(false);
        }
    };

    const resetDiscountForm = () => {
        setDiscountForm({
            title: '',
            code: '',
            discountPercentage: '10',
            isActive: true,
            applicableProducts: [],
        });
        setEditingDiscountId(null);
        setIsDiscountFormOpen(false);
    };

    const openCreateDiscountForm = () => {
        resetDiscountForm();
        setIsDiscountFormOpen(true);
    };

    const openEditDiscountForm = (disc: DiscountEvent) => {
        setEditingDiscountId(disc._id);
        setDiscountForm({
            title: disc.title,
            code: disc.code,
            discountPercentage: String(disc.discountPercentage),
            isActive: disc.isActive,
            applicableProducts: disc.applicableProducts || [],
        });
        setIsDiscountFormOpen(true);
    };

    const handleSaveDiscount = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingDiscount(true);
        setDiscountError('');

        try {
            const payload = {
                title: discountForm.title,
                code: discountForm.code,
                discountPercentage: Number(discountForm.discountPercentage),
                isActive: discountForm.isActive,
                applicableProducts: discountForm.applicableProducts,
            };

            const method = editingDiscountId ? 'PUT' : 'POST';
            const res = await fetch('/api/discounts', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingDiscountId ? { ...payload, _id: editingDiscountId } : payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to save discount event');

            resetDiscountForm();
            await loadDiscounts();
        } catch (err) {
            setDiscountError(err instanceof Error ? err.message : 'Failed to save discount event');
        } finally {
            setSavingDiscount(false);
        }
    };

    const handleDeleteDiscount = async (id: string) => {
        if (!confirm('Are you sure you want to delete this promo event?')) return;
        try {
            const res = await fetch('/api/discounts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to delete discount event');
            await loadDiscounts();
        } catch (err) {
            setDiscountError(err instanceof Error ? err.message : 'Failed to delete discount event');
        }
    };

    const toggleProductSelection = (numericId: number) => {
        setDiscountForm((prev) => {
            const exists = prev.applicableProducts.includes(numericId);
            const updated = exists
                ? prev.applicableProducts.filter((p) => p !== numericId)
                : [...prev.applicableProducts, numericId];
            return { ...prev, applicableProducts: updated };
        });
    };

    return (
        <div className="space-y-8 max-w-5xl">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-navy-950 flex items-center gap-3">
                    <Settings className="w-8 h-8 text-amber-500" />
                    <span>Global Store Settings & Discounts</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Configure dynamic delivery charges, global tax rates, and active promo discount events.</p>
            </div>

            {/* Global Settings Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
                <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-navy-900" />
                        <span>Delivery Charges & Tax Rates</span>
                    </h2>
                    <p className="text-xs text-gray-500">These rates automatically populate at checkout and invoices across the website.</p>
                </div>

                {settingsSuccess && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{settingsSuccess}</span>
                    </div>
                )}

                {settingsError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {settingsError}
                    </div>
                )}

                {loadingSettings ? (
                    <div className="text-sm text-gray-500">Loading global settings...</div>
                ) : (
                    <form onSubmit={handleSaveSettings} className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-amber-500" />
                                <span>Default Delivery Charge (PKR)</span>
                            </label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={deliveryCharge}
                                onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                <Percent className="w-4 h-4 text-amber-500" />
                                <span>Global Tax Rate (%)</span>
                            </label>
                            <input
                                required
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={taxRate}
                                onChange={(e) => setTaxRate(Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="0"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={savingSettings}
                                className="bg-navy-900 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-navy-800 disabled:opacity-60 transition-colors"
                            >
                                {savingSettings ? 'Saving Settings...' : 'Save Global Settings'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Discount Events & Coupon Codes System */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-amber-600" />
                            <span>Discount Events & Coupon Code System</span>
                        </h2>
                        <p className="text-xs text-gray-500">Active discount events will show a dynamic top banner on the home page and apply promo code discounts at checkout.</p>
                    </div>

                    <button
                        onClick={openCreateDiscountForm}
                        className="bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-400 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Promo Code</span>
                    </button>
                </div>

                {discountError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {discountError}
                    </div>
                )}

                {isDiscountFormOpen && (
                    <form onSubmit={handleSaveDiscount} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <h3 className="font-bold text-navy-950 text-sm">
                                {editingDiscountId ? 'Edit Discount Event' : 'Create New Discount Event'}
                            </h3>
                            <button type="button" onClick={resetDiscountForm} className="p-1 text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Event Title (Shown on Home Banner)</label>
                                <input
                                    required
                                    value={discountForm.title}
                                    onChange={(e) => setDiscountForm({ ...discountForm, title: e.target.value })}
                                    placeholder="Grand Azadi Sale - 15% OFF Everything"
                                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Promo / Coupon Code (e.g. AZADI15)</label>
                                <input
                                    required
                                    value={discountForm.code}
                                    onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                                    placeholder="AZADI15"
                                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white font-mono uppercase"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Percentage (%)</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={discountForm.discountPercentage}
                                    onChange={(e) => setDiscountForm({ ...discountForm, discountPercentage: e.target.value })}
                                    placeholder="15"
                                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={discountForm.isActive}
                                        onChange={(e) => setDiscountForm({ ...discountForm, isActive: e.target.checked })}
                                        className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                                    />
                                    <span>Is Event Active (Live Banner & Coupon)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">
                                Applicable Products (Leave empty for ALL products in store)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {products.map((p) => {
                                    const numId = p.numericId || parseInt(p.id.replace(/\D/g, ''), 10);
                                    const isSelected = discountForm.applicableProducts.includes(numId);
                                    return (
                                        <button
                                            type="button"
                                            key={p._id}
                                            onClick={() => toggleProductSelection(numId)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                                isSelected
                                                    ? 'bg-amber-500 text-black border-amber-500 font-bold'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                                            }`}
                                        >
                                            {p.name} {isSelected && '✓'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={resetDiscountForm} className="px-4 py-2 border rounded-xl text-sm">Cancel</button>
                            <button type="submit" disabled={savingDiscount} className="px-5 py-2 bg-navy-900 text-white rounded-xl text-sm font-medium disabled:opacity-60">
                                {savingDiscount ? 'Saving Promo...' : editingDiscountId ? 'Update Event' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                )}

                {loadingDiscounts ? (
                    <div className="text-sm text-gray-500">Loading discount events...</div>
                ) : discounts.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-400 border border-dashed rounded-xl">
                        No promotional discount events created yet. Click "Create Promo Code" to launch a campaign!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {discounts.map((disc) => (
                            <div key={disc._id} className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-navy-900 text-base">{disc.title}</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${disc.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {disc.isActive ? 'ACTIVE LIVE' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span>Code: <strong className="font-mono text-black">{disc.code}</strong></span>
                                        <span>•</span>
                                        <span>Discount: <strong className="text-amber-600">{disc.discountPercentage}% OFF</strong></span>
                                        <span>•</span>
                                        <span>Applies to: {disc.applicableProducts?.length ? `${disc.applicableProducts.length} selected items` : 'All Products'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEditDiscountForm(disc)} className="px-3 py-1.5 border rounded-lg text-xs font-medium hover:bg-gray-50">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteDiscount(disc._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
