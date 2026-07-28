import React, { useState } from 'react';
import { Search, Filter, Printer, FileText, ChevronDown, Package, Phone, MapPin, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderManagement: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Completed'>('Active');
    
    // Mock Data (Added state to simulate status changes)
    const [orders, setOrders] = useState([
        { id: '#ORD-001', customer: 'Ali Khan', contact: '0300-1234567', address: 'DHA Phase 5, Lahore', items: '2x 5L Can', amount: 'Rs. 12,500', method: 'COD', status: 'Processing' },
        { id: '#ORD-002', customer: 'Sara Ahmed', contact: '0321-9876543', address: 'Clifton, Karachi', items: '1x 200L Drum', amount: 'Rs. 82,000', method: 'Bank Transfer', status: 'Out for Delivery' },
        { id: '#ORD-003', customer: 'Imran Trading', contact: '0333-5556667', address: 'F-8, Islamabad', items: '5x 200L Drum', amount: 'Rs. 405,000', method: 'Cheque', status: 'Pending' },
        { id: '#ORD-004', customer: 'Fatima Z.', contact: '0345-1112223', address: 'Gulberg, Lahore', items: '1x 1L Bottle', amount: 'Rs. 3,500', method: 'Online', status: 'Completed' },
        { id: '#ORD-005', customer: 'Zain Corp', contact: '0300-1110000', address: 'Site Area, Karachi', items: '10x 200L Drum', amount: 'Rs. 810,000', method: 'Bank Transfer', status: 'Cancelled' },
    ]);

    const handleStatusChange = (orderId: string, newStatus: string) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Completed') return order.status === 'Completed' || order.status === 'Cancelled';
        // Active means not completed and not cancelled
        return order.status !== 'Completed' && order.status !== 'Cancelled';
    });

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
                            placeholder="Search orders..." 
                            className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex-shrink-0 bg-white">
                        <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
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

            {/* Desktop View: Standard Table */}
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
                            {filteredOrders.map((order, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200 group">
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
                                            <ChevronDown className={`w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60`} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                title="Print Packing Slip"
                                                className="p-2 text-gray-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-colors"
                                            >
                                                <Printer className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => navigate('/admin/invoice')}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg transition-colors shadow-sm text-sm font-medium"
                                            >
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

            {/* Mobile View: Clean Stacked Cards Layout */}
            <div className="md:hidden space-y-3">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
                        No orders found.
                    </div>
                ) : (
                    filteredOrders.map((order, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                            {/* Card Header: ID & Status Dropdown */}
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

                            {/* Customer Information */}
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

                            {/* Order Specs (Items & Payment) */}
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

                            {/* Footer: Amount and Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Amount</span>
                                    <span className="font-bold text-navy-900 text-sm">{order.amount}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        title="Print Packing Slip"
                                        className="p-2 text-gray-500 hover:text-navy-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Printer className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => navigate('/admin/invoice')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg transition-colors text-xs font-medium"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderManagement;