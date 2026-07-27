
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Checkout from '../pages/Checkout';
import About from '../pages/About';
import Contact from '../pages/Contact';

import AdminLayout from '../components/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import OrderManagement from '../pages/admin/OrderManagement';
import ProductInventory from '../pages/admin/ProductInventory';
import InvoiceGenerator from '../pages/admin/InvoiceGenerator';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Checkout />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="products" element={<ProductInventory />} />
                <Route path="invoice" element={<InvoiceGenerator />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
