import React from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

const ProductInventory: React.FC = () => {
    // Mock Data
    const products = [
        { id: 'PROD-01', name: 'SilkShine Premium Grade Oil', type: 'High Viscosity', size: '200L Drum', price: '82,000', stock: 45, status: 'In Stock' },
        { id: 'PROD-02', name: 'SilkShine Standard Oil', type: 'Medium Viscosity', size: '5L Can', price: '3,500', stock: 120, status: 'In Stock' },
        { id: 'PROD-03', name: 'SilkShine Industrial Grade', type: 'Heavy Duty', size: '200L Drum', price: '75,000', stock: 2, status: 'Low Stock' },
        { id: 'PROD-04', name: 'SilkShine Retail Pack', type: 'Standard', size: '1L Bottle', price: '800', stock: 500, status: 'In Stock' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-navy-950">Product & Inventory</h1>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                    <button className="bg-navy-900 text-white px-4 py-2 rounded-lg hover:bg-navy-800 transition-colors flex items-center gap-2 flex-shrink-0">
                        <Plus className="w-5 h-5" />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                            {products.map((product, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium text-navy-900">{product.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-navy-900 font-bold">{product.name}</div>
                                        <div className="text-xs text-gray-500">{product.type}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{product.size}</td>
                                    <td className="px-6 py-4 font-bold text-navy-900">{product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === 'Low Stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
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
        </div>
    );
};

export default ProductInventory;
