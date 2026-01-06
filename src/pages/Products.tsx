
import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants/products';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Star } from 'lucide-react';

const Products: React.FC = () => {
    const { addToCart } = useApp();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredProducts = PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-bold dark:text-white">{t('products')}</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Explore our complete range of premium organic hair care products.
                </p>

                {/* Search Bar */}
                <div className="max-w-md mx-auto relative mt-8">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col h-full hover:border-yellow-200 dark:hover:border-yellow-900/50">
                            <div className="h-64 overflow-hidden relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <Link to={`/product/${product.id}`} className="bg-white text-black py-2.5 px-6 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-yellow-400">
                                        {t('viewDetails')}
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-1 mb-2 text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                    ))}
                                    <span className="text-gray-400 text-sm ml-1">({product.reviews})</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">{product.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-2xl font-bold dark:text-white">${product.price}</span>
                                    <button
                                        onClick={() => addToCart(product, product.sizes[0])}
                                        className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-bold flex items-center gap-2"
                                    >
                                        {t('addToCart')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500 dark:text-gray-400">No products found for "{searchQuery}"</p>
                </div>
            )}
        </div>
    );
};

export default Products;
