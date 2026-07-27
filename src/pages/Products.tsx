import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants/products';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Star, Search, SlidersHorizontal, Grid, LayoutList, X, ShoppingBag, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const ITEMS_PER_PAGE = 6;

const Products: React.FC = () => {
    const { addToCart } = useApp();
    const { t } = useLanguage();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const categories = useMemo(() => {
        const catSet = new Set<string>();
        PRODUCTS.forEach(product => {
            if (product.category) {
                catSet.add(product.category);
            }
        });
        return ['All', ...Array.from(catSet)];
    }, []);

    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === 'All' || product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0;
        });
    }, [searchQuery, selectedCategory, sortBy]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setSortBy('featured');
        setCurrentPage(1);
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950">
            <Navbar />

            <div className="flex-grow pt-6 pb-10">
                <div className="container mx-auto px-4 md:px-8 py-6 animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-col xl:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 shrink-0">
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                {t('products')}
                            </h1>
                            <span className="hidden sm:inline-block h-4 w-px bg-gray-200 dark:bg-gray-800"></span>
                            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                                Explore our complete range of premium formulations.
                            </p>
                        </div>

                        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full xl:w-auto justify-end">
                            <div className="relative flex-grow sm:flex-grow-0 sm:w-60">
                                <input
                                    type="text"
                                    placeholder={t('searchProducts') || 'Search...'}
                                    className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-xs"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                {searchQuery && (
                                    <button
                                        onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {categories.length > 1 && (
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="dark:bg-gray-800">
                                            {cat === 'All' ? 'All Categories' : cat}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <div className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                                >
                                    <option value="featured" className="dark:bg-gray-800">Featured</option>
                                    <option value="price-low" className="dark:bg-gray-800">Price: Low to High</option>
                                    <option value="price-high" className="dark:bg-gray-800">Price: High to Low</option>
                                    <option value="rating" className="dark:bg-gray-800">Top Rated</option>
                                </select>
                            </div>

                            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-xl border border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-amber-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Grid className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-amber-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <LayoutList className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400 px-1">
                        <p>
                            Showing <span className="font-bold text-gray-900 dark:text-white">{paginatedProducts.length}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
                        </p>
                        {(searchQuery || selectedCategory !== 'All' || sortBy !== 'featured') && (
                            <button
                                onClick={handleClearFilters}
                                className="text-amber-500 hover:underline font-semibold flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Reset filters
                            </button>
                        )}
                    </div>

                    {paginatedProducts.length > 0 ? (
                        <>
                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid grid-cols-1 gap-4'}>
                                {paginatedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex ${viewMode === 'list' ? 'flex-col md:flex-row' : 'flex-col'} hover:border-amber-400/50 dark:hover:border-amber-500/30`}
                                    >
                                        <div className={`overflow-hidden relative ${viewMode === 'list' ? 'md:w-56 h-48 md:h-auto' : 'h-52'} bg-gray-100 dark:bg-gray-800`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-amber-500 shadow-sm">
                                                <Star className="w-3 h-3 fill-amber-500" />
                                                <span>{product.rating}</span>
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                <Link
                                                    to={`/product/${product.id}`}
                                                    className="bg-white text-gray-900 p-2.5 rounded-full hover:bg-amber-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                                                    title={t('viewDetails') || 'View Details'}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded">
                                                    {product.category || 'Hair Care'}
                                                </span>
                                                <h3 className="text-lg font-bold dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1 mt-1.5 mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed">
                                                    {product.description}[cite: 16]
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 mt-auto">
                                                <span className="text-lg font-black text-gray-900 dark:text-white">
                                                    Rs. {product.price.toLocaleString()}
                                                </span>
                                                <button
                                                    onClick={() => addToCart(product, product.sizes?.[0] || 'Standard')}
                                                    className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5" />
                                                    <span>{t('addToCart')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-10">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === pageNumber ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 px-4">
                            <Search className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                            <h3 className="text-lg font-bold dark:text-white mb-1">No products found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs max-w-sm mx-auto mb-4">
                                We couldn't find matches for "{searchQuery}". Try modifying your filter settings.
                            </p>
                            <button
                                onClick={handleClearFilters}
                                className="bg-amber-500 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Products;