// client/src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import { useParams } from 'react-router-dom';
import SkeletonProductCard from './SkeletonProductCard';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import { motion } from 'framer-motion';
import Input from './ui/Input';
import Card from './ui/Card';
import Button from './ui/Button';

const ProductList = ({ retailerId, externalFilters, onFilterChange, showSidebar = true }) => {
    const [internalProducts, setInternalProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const { categoryName } = useParams();
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');

    // Internal state for when ProductList is used standalone (e.g. RetailerProfilePage)
    const [internalFilters, setInternalFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        sort: 'newest',
    });

    // Determine which filters to use: external or internal
    const filters = externalFilters || internalFilters;

    const handleInternalFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        // If external control is provided, notify parent
        if (onFilterChange) {
            onFilterChange(e);
        } else {
            // Otherwise update internal state
            setInternalFilters(prevFilters => ({
                ...prevFilters,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    // Helper to handle sort change specifically if needed, or just use generic handler
    const handleSortChange = (e) => {
        handleInternalFilterChange(e);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (categoryName) { params.append('category', categoryName); }
                if (retailerId) params.append('retailerId', retailerId);

                // Use the active filters object
                if (filters.search) params.append('search', filters.search);
                if (filters.category) params.append('category', filters.category);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                if (filters.inStock) params.append('inStock', filters.inStock);
                if (filters.sort) params.append('sort', filters.sort);

                if (currentSearchTerm) { params.append('search', currentSearchTerm); }
                params.append('page', page);

                const { data } = await axios.get(`/api/products?${params.toString()}`);

                setInternalProducts(data.products || []);
                setPage(data.page);
                setPages(data.pages);
            } catch (err) {
                console.error('Error fetching products:', err);
                setInternalProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters, retailerId, categoryName, page, currentSearchTerm]);

    const handleSearch = (searchTerm) => {
        setCurrentSearchTerm(searchTerm);
        setPage(1);
    };

    return (
        <div className="product-list-page">
            <div className="flex-between mb-4">
                <h2>{categoryName || 'All Products'}</h2>
                <div className="flex gap-3">
                    <select
                        name="sort"
                        value={filters.sort}
                        onChange={handleSortChange}
                        className="p-2 rounded glass-panel text-primary outline-none"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        <option value="newest" style={{ background: '#1a1a1a' }}>Newest Arrivals</option>
                        <option value="price-asc" style={{ background: '#1a1a1a' }}>Price: Low to High</option>
                        <option value="price-desc" style={{ background: '#1a1a1a' }}>Price: High to Low</option>
                        <option value="rating" style={{ background: '#1a1a1a' }}>Top Rated</option>
                    </select>
                    <div style={{ width: '300px' }}>
                        <SearchBar onSearchSubmit={handleSearch} />
                    </div>
                </div>
            </div>

            <div className="layout-grid" style={{ display: 'grid', gridTemplateColumns: showSidebar ? '250px 1fr' : '1fr', gap: '24px' }}>
                {/* Filters Sidebar - Only show if showSidebar is true */}
                {showSidebar && (
                    <aside>
                        <Card className="glass-panel sticky-top" style={{ position: 'sticky', top: '100px' }}>
                            <h3 className="mb-3">Filters</h3>
                            <div className="filter-group mb-3">
                                <Input
                                    label="Min Price"
                                    type="number"
                                    name="minPrice"
                                    placeholder="0"
                                    value={filters.minPrice}
                                    onChange={handleInternalFilterChange}
                                />
                                <Input
                                    label="Max Price"
                                    type="number"
                                    name="maxPrice"
                                    placeholder="1000"
                                    value={filters.maxPrice}
                                    onChange={handleInternalFilterChange}
                                />
                            </div>
                            <div className="filter-group mb-3">
                                <label className="flex-center justify-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={filters.inStock}
                                        onChange={handleInternalFilterChange}
                                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                    />
                                    <span style={{ color: 'var(--text-muted)' }}>In Stock Only</span>
                                </label>
                            </div>
                            <Button variant="outline" size="sm" className="w-full" onClick={() => {
                                // Ideally we just reset state. For external, we might need a specific onReset prop or handle it in parent.
                                // For now, let's just manually reset internal or call onChange for each.
                                // Simpler: Just set internal state if internal.
                                if (!onFilterChange) {
                                    setInternalFilters({ search: '', category: '', minPrice: '', maxPrice: '', inStock: false, sort: 'newest' });
                                } else {
                                    // If external, parent should handle reset. We can't easily trigger it from here without a specific prop.
                                    // For this refactor, we'll assume parent handles reset via its own UI if external.
                                    // But wait, if showSidebar is true, we ARE the UI.
                                    // If showSidebar is true AND externalFilters is provided (unlikely combo for this specific task, but possible),
                                    // we should probably allow resetting.
                                    // For the specific task "move filters to home page", showSidebar will be false in HomePage, so this button won't exist there.
                                    // It will only exist in RetailerProfilePage where showSidebar=true and externalFilters=undefined.
                                    setInternalFilters({ search: '', category: '', minPrice: '', maxPrice: '', inStock: false, sort: 'newest' });
                                }
                            }}>
                                Reset Filters
                            </Button>
                        </Card>
                    </aside>
                )}

                {/* Product Grid */}
                <div>
                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                        {loading ? (
                            Array.from({ length: 8 }).map((_, index) => <SkeletonProductCard key={index} />)
                        ) : internalProducts.length > 0 ? (
                            internalProducts.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <ProductItem product={product} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-5">
                                <p className="text-muted">No products found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <Pagination pages={pages} page={page} setPage={setPage} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
