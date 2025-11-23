// client/src/components/WholesalerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductEditModal from './ProductEditModal';
import { toast } from 'react-toastify';
import StatsCard from './ui/StatsCard';
import WholesalerInventory from './dashboard/wholesaler/WholesalerInventory';
import WholesalerOrders from './dashboard/wholesaler/WholesalerOrders';

const WholesalerDashboard = () => {
    const [myProducts, setMyProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    // Stats State
    const [stats, setStats] = useState({
        totalInventoryValue: 0,
        totalStock: 0,
        retailerOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });

    const fetchDashboardData = async () => {
        try {
            const productsRes = await axios.get('/api/products/myproducts');
            setMyProducts(productsRes.data);

            const salesRes = await axios.get('/api/wholesale-orders/my-sales');
            setSales(salesRes.data);

            // Calculate Stats
            const inventoryValue = productsRes.data.reduce((acc, p) => acc + (p.price * p.stock), 0);
            const totalStock = productsRes.data.reduce((acc, p) => acc + p.stock, 0);
            const pending = salesRes.data.filter(o => o.status === 'Pending').length;
            const revenue = salesRes.data.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

            setStats({
                totalInventoryValue: inventoryValue,
                totalStock: totalStock,
                retailerOrders: salesRes.data.length,
                pendingOrders: pending,
                totalRevenue: revenue
            });

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const res = await axios.put(`/api/wholesale-orders/${orderId}/status`, { status: newStatus });
            setSales(sales.map(s => s._id === orderId ? res.data : s));
            toast.success('Order status updated!');
            // Update pending stats locally
            if (newStatus !== 'Pending') {
                setStats(prev => ({ ...prev, pendingOrders: prev.pendingOrders - 1 }));
            }
        } catch (err) {
            toast.error('Failed to update order status.');
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/products/${productId}`);
                setMyProducts(myProducts.filter(p => p._id !== productId));
                toast.success('Product deleted.');
            } catch (err) {
                toast.error('Failed to delete product.');
            }
        }
    };

    const handleProductUpdate = (updatedProduct) => {
        setMyProducts(myProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    };

    return (
        <div className="page-wrapper page-dashboard container">
            {editingProduct && (
                <ProductEditModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onProductUpdate={handleProductUpdate}
                />
            )}

            <div className="dashboard-header" style={{ marginBottom: 'var(--space-8)' }}>
                <h1>Wholesaler Dashboard</h1>
                <p>Manage your central inventory and retailer orders.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon="💰"
                    color="primary"
                    trend="up"
                    trendValue="12%"
                />
                <StatsCard
                    title="Inventory Value"
                    value={`₹${stats.totalInventoryValue.toLocaleString()}`}
                    icon="💎"
                    color="primary"
                />
                <StatsCard
                    title="Total Stock Units"
                    value={stats.totalStock.toLocaleString()}
                    icon="📦"
                    color="secondary"
                />
                <StatsCard
                    title="Retailer Orders"
                    value={stats.retailerOrders}
                    icon="🚚"
                    color="accent"
                    trend="up"
                    trendValue="8%"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon="⏳"
                    color="primary"
                />
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
                {/* Left Column: Inventory */}
                <div className="flex flex-col gap-6">

                    <WholesalerInventory
                        products={myProducts}
                        loading={loading}
                        onEdit={setEditingProduct}
                        onDelete={handleDelete}
                        onAddNew={() => document.getElementById('ws-product-form').scrollIntoView({ behavior: 'smooth' })}
                    />

                    <section id="ws-product-form" className="dashboard-section">
                        <ProductForm onProductAdd={(newProduct) => setMyProducts([...myProducts, newProduct])} />
                    </section>
                </div>

                {/* Right Column: Retailer Orders */}
                <div className="flex flex-col gap-6">
                    <WholesalerOrders
                        orders={sales}
                        onStatusUpdate={handleStatusUpdate}
                    />
                </div>
            </div>
        </div>
    );
};

export default WholesalerDashboard;