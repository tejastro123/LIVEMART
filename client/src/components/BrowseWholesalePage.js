// client/src/components/BrowseWholesalePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WholesaleProductItem from './WholesaleProductItem';
import SkeletonProductCard from './SkeletonProductCard';
import SearchBar from './SearchBar';
import { motion } from 'framer-motion';

const BrowseWholesalePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchWholesaleProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/products/wholesale');
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch wholesale products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWholesaleProducts();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.retailer?.name && product.retailer.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="page-wrapper">
            <div className="mb-8">
                <h1 className="mb-3">Browse Wholesale Market</h1>
                <p className="text-muted">Source products directly from wholesalers at bulk prices.</p>
            </div>

            <div className="flex-between mb-6 flex-wrap gap-4">
                <div className="w-full md:w-1/3">
                    <SearchBar onSearchSubmit={handleSearch} placeholder="Search wholesale products..." />
                </div>
                <div className="text-sm text-muted">
                    Showing {filteredProducts.length} products
                </div>
            </div>

            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => <SkeletonProductCard key={index} />)
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <WholesaleProductItem product={product} />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 glass-panel rounded-xl">
                        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}>🔍</div>
                        <p className="text-lg text-muted">No wholesale products found matching "{searchTerm}".</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseWholesalePage;