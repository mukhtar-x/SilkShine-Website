import React, { useState } from 'react';
import { Search, Filter, Printer, FileText, ChevronDown } from 'lucide-react';
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-navy-950">Order Management</h1>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search orders..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex-shrink-0">
                        <Filter className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                {['Active', 'Completed', 'All'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === tab ? 'border-b-2 border-amber-500 text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab} Orders
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
        </div>
    );
};

export default OrderManagement;
