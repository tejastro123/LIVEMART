// client/src/components/RetailerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductEditModal from './ProductEditModal';
import { toast } from 'react-toastify';
import StatsCard from './ui/StatsCard';
import RetailerInventory from './dashboard/retailer/RetailerInventory';
import RetailerOrders from './dashboard/retailer/RetailerOrders';
import RetailerQueries from './dashboard/retailer/RetailerQueries';
import RetailerPurchases from './dashboard/retailer/RetailerPurchases';

const RetailerDashboard = () => {
    const [myProducts, setMyProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [queries, setQueries] = useState([]);
    const [sales, setSales] = useState([]);

    // Stats State
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        activeProducts: 0,
        pendingQueries: 0
    });

    const fetchMyProducts = async () => {
        try {
            const res = await axios.get('/api/products/myproducts');
            setMyProducts(res.data);

            const salesRes = await axios.get('/api/orders/sales');
            setSales(salesRes.data);

            // Calculate Stats
            const revenue = salesRes.data.reduce((acc, order) => acc + (order.subTotal || 0), 0);
            const orders = salesRes.data.length;
            const products = res.data.length;

            setStats(prev => ({
                ...prev,
                totalRevenue: revenue,
                totalOrders: orders,
                activeProducts: products
            }));

        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const queriesRes = await axios.get('/api/queries/received-queries');
            setQueries(queriesRes.data);
            setStats(prev => ({
                ...prev,
                pendingQueries: queriesRes.data.filter(q => q.status !== 'Closed').length
            }));
        } catch (err) {
            console.error('Error fetching queries:', err);
        }
    };

    useEffect(() => {
        fetchMyProducts();
        fetchDashboardData();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const res = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            setSales(sales.map(sale => sale._id === orderId ? { ...sale, status: res.data.status } : sale));
            toast.success('Order status updated!');
        } catch (err) {
            toast.error('Failed to update status.');
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/products/${productId}`);
                setMyProducts(myProducts.filter(p => p._id !== productId));
                toast.success('Product deleted successfully.');
            } catch (err) {
                console.error('Error deleting product:', err);
                toast.error('Failed to delete product.');
            }
        }
    };

    const handleProductUpdate = (updatedProduct) => {
        setMyProducts(myProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    };

    const handleReplySubmit = async (queryId, message) => {
        if (!message) return;
        try {
            await axios.post(`/api/queries/${queryId}/reply`, { message });
            fetchDashboardData();
            toast.success('Reply sent!');
        } catch (err) { toast.error('Failed to send reply.'); }
    };

    const handleStatusChange = async (queryId, newStatus) => {
        try {
            await axios.put(`/api/queries/${queryId}/status`, { status: newStatus });
            fetchDashboardData();
            toast.success(`Query marked as ${newStatus}`);
        } catch (err) { toast.error('Failed to update status.'); }
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
                <h1>Retailer Dashboard</h1>
                <p>Overview of your store performance and inventory.</p>
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
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon="📦"
                    color="secondary"
                    trend="up"
                    trendValue="5%"
                />
                <StatsCard
                    title="Active Products"
                    value={stats.activeProducts}
                    icon="🏷️"
                    color="accent"
                />
                <StatsCard
                    title="Pending Queries"
                    value={stats.pendingQueries}
                    icon="💬"
                    color="primary"
                />
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
                {/* Left Column: Inventory & Orders */}
                <div className="flex flex-col gap-6">

                    <RetailerInventory
                        products={myProducts}
                        loading={loading}
                        onEdit={setEditingProduct}
                        onDelete={handleDelete}
                        onAddNew={() => document.getElementById('product-form-scroll').scrollIntoView({ behavior: 'smooth' })}
                    />

                    <RetailerOrders
                        orders={sales}
                        onStatusUpdate={handleStatusUpdate}
                    />

                    <RetailerPurchases />

                    {/* Add Product Form */}
                    <section id="product-form-scroll" className="dashboard-section">
                        <ProductForm onProductAdd={(newProduct) => setMyProducts([...myProducts, newProduct])} />
                    </section>
                </div>

                {/* Right Column: Queries */}
                <div className="flex flex-col gap-6">
                    <RetailerQueries
                        queries={queries}
                        onReplySubmit={handleReplySubmit}
                        onStatusChange={handleStatusChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default RetailerDashboard;