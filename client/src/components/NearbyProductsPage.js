// client/src/components/NearbyProductsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import SkeletonProductCard from './SkeletonProductCard';
import Card from './ui/Card';
import Button from './ui/Button';
import { toast } from 'react-toastify';

const NearbyProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [distance, setDistance] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);

    useEffect(() => {
        // Try to get location on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => {
                    console.warn("Geolocation denied or failed:", err);
                    // We'll proceed without location, server will fallback
                }
            );
        }
    }, []);

    useEffect(() => {
        const fetchNearbyProducts = async () => {
            setLoading(true);
            try {
                let url = `/api/products/nearby?distance=${distance}`;
                if (location) {
                    url += `&lat=${location.lat}&lng=${location.lng}`;
                }

                const res = await axios.get(url);
                setProducts(res.data);
                setError('');
            } catch (err) {
                setError(err.response?.data?.msg || 'Could not fetch nearby products.');
            } finally {
                setLoading(false);
            }
        };

        // Fetch if we have location OR if we've waited enough (fallback on server)
        // But to avoid double fetch, let's just fetch. Server handles missing location.
        fetchNearbyProducts();
    }, [distance, location]);

    const handleRequestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    toast.success("Location updated!");
                },
                () => toast.error("Could not access location.")
            );
        }
    };

    return (
        <div className="page-wrapper">
            <div className="flex-between mb-5">
                <h1 className="text-3xl font-bold text-gradient">Products Near You</h1>

                <div className="flex gap-3 items-center">
                    {!location && (
                        <Button size="sm" variant="outline" onClick={handleRequestLocation}>
                            Use My Location
                        </Button>
                    )}
                    <Card className="glass-panel p-2 flex items-center gap-3">
                        <label htmlFor="distance-filter" className="font-medium text-sm">Distance:</label>
                        <select
                            id="distance-filter"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            className="bg-glass border-glass rounded p-1 text-main outline-none focus:ring-2 focus:ring-primary"
                            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                        >
                            <option value="2" style={{ background: '#1a1a1a' }}>2 km</option>
                            <option value="5" style={{ background: '#1a1a1a' }}>5 km</option>
                            <option value="10" style={{ background: '#1a1a1a' }}>10 km</option>
                            <option value="20" style={{ background: '#1a1a1a' }}>20 km</option>
                            <option value="50" style={{ background: '#1a1a1a' }}>50 km</option>
                        </select>
                    </Card>
                </div>
            </div>

            {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <SkeletonProductCard key={index} />
                    ))
                ) : products.length > 0 ? (
                    products.map(product => (
                        <ProductItem key={product._id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-xl text-muted">No products found within {distance}km.</p>
                        <p className="text-sm text-muted mt-2">Try increasing the search distance or updating your location.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NearbyProductsPage;