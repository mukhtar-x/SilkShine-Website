'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Star, MessageSquare } from 'lucide-react';

// Robust Google Drive Image URL Converter Utility
const formatDriveImageUrl = (url: string): string => {
    console.log("ok");

    if (!url || typeof url !== 'string') return '';
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}`;
    }
    return url;
};

type ProductReview = {
    _id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
};

type AdminProduct = {
    _id: string;
    id: string;
    numericId?: number;
    name: string;
    type: string;
    size: string;
    price: string | number;
    oldPrice?: number;
    stock: number;
    status: string;
    description?: string;
    image?: string;
    images?: string[];
    features?: string[];
    category?: string;
    sizes?: string[];
    rating?: number;
    reviews?: number;
    reviewsList?: ProductReview[];
};

const emptyForm = {
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    stock: '',
    category: 'Hair Care',
    type: 'Standard',
    sizes: '1L Bottle',
    image: '/assets/bottle-shot.png',
    images: '',
    features: '',
    rating: '5.0',
    reviews: '0',
};

export default function ProductInventoryPage() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchingDetail, setFetchingDetail] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [reviewsList, setReviewsList] = useState<ProductReview[]>([]);
    const [saving, setSaving] = useState(false);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to load inventory');
            setProducts(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const q = search.toLowerCase();
            return !q || product.name.toLowerCase().includes(q) || product.type.toLowerCase().includes(q);
        });
    }, [products, search]);

    const resetForm = () => {
        setForm(emptyForm);
        setReviewsList([]);
        setEditingId(null);
        setIsFormOpen(false);
    };

    const openCreateForm = () => {
        setForm(emptyForm);
        setReviewsList([]);
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = async (product: AdminProduct) => {
        setEditingId(product._id);
        setIsFormOpen(true);
        setFetchingDetail(true);
        setError('');

        try {
            const lookupId = product.numericId || product.id || product._id;
            const res = await fetch(`/api/products/${lookupId}`);
            const fullProduct = await res.json();

            if (!res.ok || !fullProduct) {
                throw new Error(fullProduct?.error || 'Failed to fetch product details');
            }

            setForm({
                name: fullProduct.name || product.name,
                description: fullProduct.description || '',
                price: String(fullProduct.price ?? product.price),
                oldPrice: fullProduct.oldPrice ? String(fullProduct.oldPrice) : '',
                stock: String(fullProduct.stock ?? product.stock),
                category: fullProduct.category || 'Hair Care',
                type: fullProduct.type || 'Standard',
                sizes: Array.isArray(fullProduct.sizes) ? fullProduct.sizes.join(', ') : product.size,
                image: fullProduct.image || '/assets/bottle-shot.png',
                images: Array.isArray(fullProduct.images) ? fullProduct.images.join(', ') : '',
                features: Array.isArray(fullProduct.features) ? fullProduct.features.join('\n') : '',
                rating: String(fullProduct.rating ?? 5.0),
                reviews: String(fullProduct.reviews ?? 0),
            });

            setReviewsList(Array.isArray(fullProduct.reviewsList) ? fullProduct.reviewsList : []);
        } catch (err) {
            console.error('Error fetching product details:', err);
            setForm({
                name: product.name,
                description: product.description || '',
                price: String(product.price),
                oldPrice: product.oldPrice ? String(product.oldPrice) : '',
                stock: String(product.stock),
                category: product.category || 'Hair Care',
                type: product.type || 'Standard',
                sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.size,
                image: product.image || '/assets/bottle-shot.png',
                images: Array.isArray(product.images) ? product.images.join(', ') : '',
                features: Array.isArray(product.features) ? product.features.join('\n') : '',
                rating: String(product.rating ?? 5.0),
                reviews: String(product.reviews ?? 0),
            });
            setReviewsList(product.reviewsList || []);
        } finally {
            setFetchingDetail(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');


        try {
            const payload = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                oldPrice: form.oldPrice ? Number(form.oldPrice) : 0,
                stock: Number(form.stock),
                category: form.category,
                type: form.type,
                sizes: form.sizes.split(',').map((size) => size.trim()).filter(Boolean),
                image: await formatDriveImageUrl(form.image),
                images: await Promise.all(
                    form.images.split(',').map((img) => formatDriveImageUrl(img.trim()))
                ).then((urls) => urls.filter(Boolean)),
                features: form.features.split('\n').map((feat) => feat.trim()).filter(Boolean),
                rating: Number(form.rating),
                reviews: Number(form.reviews),
            };

            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch('/api/admin/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingId ? { ...payload, _id: editingId } : payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Unable to save product');
            resetForm();
            await loadProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            setError('');
            const res = await fetch('/api/admin/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: productId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Unable to delete product');
            await loadProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to delete product');
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!editingId) return;
        if (!confirm('Are you sure you want to delete this customer review?')) return;

        try {
            const res = await fetch(`/api/admin/products/${editingId}/reviews?reviewId=${reviewId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to delete review');

            setReviewsList((prev) => prev.filter((r) => String(r._id) !== String(reviewId)));
            if (data?.product) {
                setForm((prev) => ({
                    ...prev,
                    rating: String(data.product.rating ?? 5.0),
                    reviews: String(data.product.reviews ?? 0),
                }));
            }
            await loadProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete review');
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-navy-950">Product & Inventory</h1>
                    <p className="text-sm text-gray-500">Manage catalog, pre-filled attributes, features, and customer reviews.</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                    <button
                        onClick={openCreateForm}
                        className="bg-navy-900 text-white px-3.5 md:px-4 py-2 rounded-lg hover:bg-navy-800 transition-colors flex items-center gap-2 flex-shrink-0 text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100">
                    {error}
                </div>
            )}

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 space-y-6 shadow-sm">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-navy-950">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                            {fetchingDetail && <span className="text-xs text-amber-600 animate-pulse">(Pre-filling data...)</span>}
                        </div>
                        <button type="button" onClick={resetForm} className="p-2 rounded-lg hover:bg-gray-100">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
                            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product Name" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Type / Subtitle *</label>
                            <input required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type (e.g. 100% Organic Hair Oil)" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Selling Price (Rs.) *</label>
                            <input required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Selling Price" type="number" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Original / Old Price (Rs.)</label>
                            <input value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="Original Price (for discount badge)" type="number" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Level *</label>
                            <input required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Available Sizes (comma separated)</label>
                            <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="100ml, 250ml, 500ml" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Main Image URL (Google Drive / Direct Link)</label>
                            <input
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                                onBlur={(e) => setForm({ ...form, image: formatDriveImageUrl(e.target.value) })}
                                placeholder="/assets/bottle-shot.png or Drive link"
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Gallery Images (comma separated URLs)</label>
                            <input
                                value={form.images}
                                onChange={(e) => setForm({ ...form, images: e.target.value })}
                                onBlur={(e) => {
                                    const formatted = e.target.value
                                        .split(',')
                                        .map((img) => formatDriveImageUrl(img.trim()))
                                        .filter(Boolean)
                                        .join(', ');
                                    setForm({ ...form, images: formatted });
                                }}
                                placeholder="/assets/bottle-shot.png, https://drive.google.com/..."
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
                                <span>Product Features (Each line becomes a feature bullet point)</span>
                            </label>
                            <textarea
                                value={form.features}
                                onChange={(e) => setForm({ ...form, features: e.target.value })}
                                placeholder={`100% Pure Cold-Pressed Argan Oil\nDeeply Nourishes & Strengthens Roots\nReduces Frizz & Promotes Natural Shine`}
                                className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description..." className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]" />
                        </div>
                    </div>

                    {/* Customer Reviews Section in Admin Form */}
                    {editingId && (
                        <div className="border-t border-gray-100 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-amber-600" />
                                    <span>Customer Reviews ({reviewsList.length})</span>
                                </h3>
                                <span className="text-xs text-gray-500">Average Rating: {form.rating} ★</span>
                            </div>

                            {reviewsList.length === 0 ? (
                                <p className="text-xs text-gray-400 italic">No customer reviews submitted for this product yet.</p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {reviewsList.map((rev) => (
                                        <div key={rev._id} className="p-3 bg-gray-50 rounded-lg flex items-start justify-between gap-3 text-xs border border-gray-100">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-navy-900">{rev.user}</span>
                                                    <div className="flex text-amber-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400">{new Date(rev.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-600">"{rev.comment}"</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteReview(rev._id)}
                                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                                                title="Delete Review"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border text-sm font-medium">Cancel</button>
                        <button type="submit" disabled={saving || fetchingDetail} className="px-5 py-2 rounded-lg bg-navy-900 text-white text-sm font-medium disabled:opacity-60">
                            {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="rounded-xl bg-white p-6 text-sm text-gray-500">Loading inventory…</div>
            ) : (
                <>
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                        <th className="px-6 py-4 font-semibold">Product ID</th>
                                        <th className="px-6 py-4 font-semibold">Name & Type</th>
                                        <th className="px-6 py-4 font-semibold">Size/Packaging</th>
                                        <th className="px-6 py-4 font-semibold">Unit Price (Rs.)</th>
                                        <th className="px-6 py-4 font-semibold">Stock Level</th>
                                        <th className="px-6 py-4 font-semibold">Rating / Reviews</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 font-medium text-navy-900">{product.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-navy-900 font-bold">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.type}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{product.size || product.sizes?.[0]}</td>
                                            <td className="px-6 py-4 font-bold text-navy-900">
                                                Rs. {Number(product.price).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>{product.stock}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                    <span className="font-bold">{product.rating ?? 5.0}</span>
                                                    <span className="text-gray-400">({product.reviews ?? 0})</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === 'Low Stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{product.status}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEditForm(product)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Pre-fill & Edit Product">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(product._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Product">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="md:hidden space-y-3">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <span className="font-bold text-navy-900 text-sm">{product.id}</span>
                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${product.status === 'Low Stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{product.status}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy-900 text-sm">{product.name}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{product.type}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-3 gap-2 text-center text-xs">
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-medium">Size</span>
                                        <span className="font-semibold text-gray-700">{product.size || product.sizes?.[0]}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-medium">Stock</span>
                                        <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-navy-900'}`}>{product.stock}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-medium">Price</span>
                                        <span className="font-bold text-navy-900">Rs. {Number(product.price).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                    <button onClick={() => openEditForm(product)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(product._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}   