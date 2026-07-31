'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Printer, FileText, ChevronDown, Package, Phone, MapPin, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AdminOrder = {
    id: string;
    customer: string;
    contact: string;
    address: string;
    items: string;
    amount: string;
    method: string;
    status: string;
    _id?: string;
};

export default function OrderManagementPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Completed'>('Active');
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to load orders');
            setOrders(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Unable to change order status');
            setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: newStatus } : order));
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to change order status');
        }
    };

    const filteredOrders = useMemo(() => {
        const matched = orders.filter((order) => {
            const q = search.toLowerCase();
            const matchesSearch = !q || order.customer.toLowerCase().includes(q) || order.id.toLowerCase().includes(q);
            if (!matchesSearch) return false;
            if (activeTab === 'All') return true;
            if (activeTab === 'Completed') return order.status === 'Completed' || order.status === 'Cancelled';
            return order.status !== 'Completed' && order.status !== 'Cancelled';
        });
        return matched;
    }, [orders, activeTab, search]);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Out for Delivery': return 'bg-amber-100 text-amber-800';
            case 'Pending': return 'bg-gray-100 text-gray-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-navy-950">Order Management</h1>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search orders..."
                            className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex-shrink-0 bg-white">
                        <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100">
                    {error}
                </div>
            )}

            <div className="flex border-b gap-2 md:gap-2 md:py-2 py-2 border-gray-200 overflow-x-none md:flex-nowrap flex-wrap scrollbar-none">
                {['Active', 'Completed', 'All'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 md:px-6 py-2.5 md:py-3 font-semibold text-xs md:text-sm whitespace-nowrap transition-colors rounded-lg bg-white ${activeTab === tab ? 'border-2 border-amber-500 text-amber-600' : 'text-gray-500 border-neutral-300 border hover:text-gray-700'}`}
                    >
                        {tab} Orders
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="rounded-xl bg-white p-6 text-sm text-gray-500">Loading orders…</div>
            ) : (
                <>
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                        <th className="px-6 py-4 font-semibold">Order ID</th>
                                        <th className="px-6 py-4 font-semibold">Customer Details</th>
                                        <th className="px-6 py-4 font-semibold">Items</th>
                                        <th className="px-6 py-4 font-semibold">Total</th>
                                        <th className="px-6 py-4 font-semibold">Payment</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                                            <td className="px-6 py-4 font-medium text-navy-900">{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-navy-900 font-medium">{order.customer}</div>
                                                <div className="text-xs text-gray-500">{order.contact}</div>
                                                <div className="text-xs text-gray-400 truncate max-w-[150px]">{order.address}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 text-sm">{order.items}</td>
                                            <td className="px-6 py-4 font-bold text-navy-900">{order.amount}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.method}</td>
                                            <td className="px-6 py-4">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className={`appearance-none px-4 py-1.5 pr-8 rounded-full text-xs font-semibold focus:outline-none cursor-pointer transition-colors ${getStatusColor(order.status)}`}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Out for Delivery">Out for Delivery</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                    <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button title="Print Packing Slip" className="p-2 text-gray-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-colors">
                                                        <Printer className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => router.push(`/admin/invoice?orderId=${encodeURIComponent(order.id)}`)} className="flex items-center gap-2 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg transition-colors shadow-sm text-sm font-medium">
                                                        <FileText className="w-4 h-4" />
                                                        Generate Invoice
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
                        {filteredOrders.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">No orders found.</div>
                        ) : (
                            filteredOrders.map((order) => (
                                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                        <span className="font-bold text-navy-900 text-sm">{order.id}</span>
                                        <div className="relative">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`appearance-none px-3 py-1 pr-7 rounded-full text-[11px] font-semibold focus:outline-none cursor-pointer ${getStatusColor(order.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-xs text-gray-600">
                                        <div className="font-bold text-navy-900 text-sm">{order.customer}</div>
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span>{order.contact}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="truncate">{order.address}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2.5 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-gray-700">
                                            <Package className="w-3.5 h-3.5 text-gray-400" />
                                            <span>{order.items}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                                            <span>{order.method}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Amount</span>
                                            <span className="font-bold text-navy-900 text-sm">{order.amount}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button title="Print Packing Slip" className="p-2 text-gray-500 hover:text-navy-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Printer className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => router.push(`/admin/invoice?orderId=${encodeURIComponent(order.id)}`)} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg transition-colors text-xs font-medium">
                                                <FileText className="w-3.5 h-3.5" />
                                                Invoice
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
