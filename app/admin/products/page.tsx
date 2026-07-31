'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

type AdminProduct = {
    _id: string;
    id: string;
    name: string;
    type: string;
    size: string;
    price: string | number;
    stock: number;
    status: string;
    description?: string;
    image?: string;
    category?: string;
    sizes?: string[];
    rating?: number;
    reviews?: number;
};

const emptyForm = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Hair Care',
    type: 'Standard',
    sizes: '1L Bottle',
    image: '/assets/bottle-shot.png',
    rating: '4.8',
    reviews: '0',
};

export default function ProductInventoryPage() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
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
        setEditingId(null);
        setIsFormOpen(false);
    };

    const openCreateForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (product: AdminProduct) => {
        setEditingId(product._id);
        setForm({
            name: product.name,
            description: product.description || '',
            price: String(product.price),
            stock: String(product.stock),
            category: product.category || 'Hair Care',
            type: product.type || 'Standard',
            sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.size,
            image: product.image || '/assets/bottle-shot.png',
            rating: String(product.rating ?? 4.8),
            reviews: String(product.reviews ?? 0),
        });
        setIsFormOpen(true);
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
                stock: Number(form.stock),
                category: form.category,
                type: form.type,
                sizes: form.sizes.split(',').map((size) => size.trim()).filter(Boolean),
                image: form.image,
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

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-navy-950">Product & Inventory</h1>
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
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-navy-950">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                        <button type="button" onClick={resetForm} className="p-2 rounded-lg hover:bg-gray-100">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="border rounded-lg px-3 py-2 text-sm" />
                        <input required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type" className="border rounded-lg px-3 py-2 text-sm" />
                        <input required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="border rounded-lg px-3 py-2 text-sm" />
                        <input required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" className="border rounded-lg px-3 py-2 text-sm" />
                        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="border rounded-lg px-3 py-2 text-sm" />
                        <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="Sizes (comma separated)" className="border rounded-lg px-3 py-2 text-sm" />
                        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="border rounded-lg px-3 py-2 text-sm md:col-span-2" />
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border rounded-lg px-3 py-2 text-sm md:col-span-2 min-h-[100px]" />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border">Cancel</button>
                        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-navy-900 text-white disabled:opacity-60">
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
                                            <td className="px-6 py-4 text-gray-700">{product.size}</td>
                                            <td className="px-6 py-4 font-bold text-navy-900">{product.price}</td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>{product.stock}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === 'Low Stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{product.status}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEditForm(product)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(product._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
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
                                        <span className="font-semibold text-gray-700">{product.size}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-medium">Stock</span>
                                        <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-navy-900'}`}>{product.stock}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-medium">Price (Rs.)</span>
                                        <span className="font-bold text-navy-900">{product.price}</span>
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
