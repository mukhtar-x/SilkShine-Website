import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, FileText, Settings, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/admin/orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
        { path: '/admin/products', label: 'Products & Inventory', icon: <Package className="w-5 h-5" /> },
        { path: '/admin/invoice', label: 'Invoice Generator', icon: <FileText className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-navy-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar - hidden on print */}
            <aside className="w-full md:w-64 bg-navy-900 text-white flex flex-col print-hidden shrink-0 shadow-xl z-20">
                <div className="p-6 flex items-center justify-center border-b border-navy-800">
                    <h1 className="text-2xl font-bold text-amber-500 tracking-tight">Silkshine Admin</h1>
                </div>
                
                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                isActive(item.path) 
                                ? 'bg-amber-500 text-navy-950 font-semibold' 
                                : 'hover:bg-navy-800 text-navy-100 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-navy-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-navy-100 hover:bg-navy-800 hover:text-white transition-colors duration-200">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-navy-400 hover:bg-navy-800 hover:text-white transition-colors duration-200 mt-2 text-sm">
                        <span>← Back to Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 text-charcoal-900 flex flex-col print:bg-white print:overflow-visible">
                <div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto print:max-w-none print:p-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
