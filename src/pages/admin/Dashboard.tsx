import React from 'react';
import { IndianRupee, Package, ShoppingCart, Truck } from 'lucide-react';

const Dashboard: React.FC = () => {
    // Mock Data
    const metrics = [
        { label: 'Total Sales', value: 'Rs. 245,000', icon: <IndianRupee className="w-5 h-5 md:w-6 md:h-6" />, color: 'bg-green-100 text-green-600' },
        { label: 'Active Orders', value: '14', icon: <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />, color: 'bg-blue-100 text-blue-600' },
        { label: 'Pending Deliveries', value: '8', icon: <Truck className="w-5 h-5 md:w-6 md:h-6" />, color: 'bg-amber-100 text-amber-600' },
        { label: 'Low Stock Items', value: '3', icon: <Package className="w-5 h-5 md:w-6 md:h-6" />, color: 'bg-red-100 text-red-600' },
    ];

    const recentOrders = [
        { id: '#ORD-001', customer: 'Ali Khan', amount: 'Rs. 12,500', status: 'Processing' },
        { id: '#ORD-002', customer: 'Sara Ahmed', amount: 'Rs. 8,200', status: 'Out for Delivery' },
        { id: '#ORD-003', customer: 'Imran Trading', amount: 'Rs. 45,000', status: 'Pending' },
        { id: '#ORD-004', customer: 'Fatima Z.', amount: 'Rs. 3,500', status: 'Delivered' },
    ];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Out for Delivery': return 'bg-amber-100 text-amber-800';
            case 'Pending': return 'bg-gray-100 text-gray-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-navy-950 px-1">Dashboard Overview</h1>
            
            {/* Metrics Grid - 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 transition-transform duration-200 hover:-translate-y-1">
                        <div className={`p-2.5 md:p-4 rounded-full w-fit ${metric.color}`}>
                            {metric.icon}
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-500 font-medium">{metric.label}</p>
                            <h3 className="text-lg md:text-2xl font-bold text-navy-900">{metric.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg md:text-xl font-bold text-navy-950">Recent Orders</h2>
                    <button className="text-xs md:text-sm font-semibold text-amber-600 hover:text-amber-700">View All</button>
                </div>
                
                {/* Desktop View: Standard Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((order, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium text-navy-900">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                                    <td className="px-6 py-4 font-medium text-navy-900">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: Card Based Layout */}
                <div className="md:hidden divide-y divide-gray-100 flex flex-col">
                    {recentOrders.map((order, idx) => (
                        <div key={idx} className="p-4 hover:bg-gray-50 flex flex-col gap-3 transition-colors duration-200">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="font-bold text-navy-900 text-sm">{order.id}</span>
                                    <span className="text-gray-600 text-xs mt-0.5">{order.customer}</span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-gray-50">
                                <span className="text-xs text-gray-500 font-medium">Total Amount</span>
                                <span className="font-bold text-navy-900 text-sm">{order.amount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;