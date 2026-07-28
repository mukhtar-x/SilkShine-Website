import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, FileText, LogOut, Menu, X } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/admin/orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
        { path: '/admin/products', label: 'Products & Inventory', icon: <Package className="w-5 h-5" /> },
        { path: '/admin/invoice', label: 'Invoice Generator', icon: <FileText className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-navy-50 flex flex-col md:flex-row font-sans">
            
            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden flex items-center justify-between bg-navy-900 text-white p-4 z-30 shadow-md print-hidden">
                <h1 className="text-xl font-bold text-amber-500 tracking-tight">Silkshine Admin</h1>
                <button 
                    onClick={toggleMenu} 
                    className="p-1 rounded-md text-navy-100 hover:text-white hover:bg-navy-800 transition-colors"
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay Background */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm z-40 md:hidden print-hidden transition-opacity"
                    onClick={closeMenu}
                />
            )}

            {/* Sidebar - Slide-out drawer on mobile, static column on desktop */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 text-white flex flex-col print-hidden shadow-2xl md:shadow-xl
                transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Desktop Logo (Hidden on mobile as it's in the top bar) */}
                <div className="hidden md:flex p-6 items-center justify-center border-b border-navy-800">
                    <h1 className="text-2xl font-bold text-amber-500 tracking-tight">Silkshine Admin</h1>
                </div>
                
                {/* Mobile Drawer Header */}
                <div className="md:hidden p-5 flex items-center justify-between border-b border-navy-800">
                    <h2 className="text-lg font-bold text-amber-500">Menu</h2>
                    <button onClick={closeMenu} className="p-1 text-navy-100 hover:text-white bg-navy-800 rounded-md">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeMenu} // Close the menu when a link is clicked on mobile
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
            <main className="flex-1 h-[calc(100vh-60px)] md:h-screen overflow-x-hidden overflow-y-auto bg-gray-50 text-charcoal-900 flex flex-col print:bg-white print:overflow-visible print:h-auto">
                <div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto print:max-w-none print:p-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;