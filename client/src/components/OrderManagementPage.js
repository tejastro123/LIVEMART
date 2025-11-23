// client/src/components/OrderManagementPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { generateGoogleCalendarLink } from '../utils/calendarUtils';
import Card from './ui/Card';
import StatsCard from './ui/StatsCard';
import SearchBar from './SearchBar';
import { motion, AnimatePresence } from 'framer-motion';

const OrderManagementPage = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0
    });

    const calculateStats = (data) => {
        const totalOrders = data.length;
        const pendingOrders = data.filter(o => o.status === 'Pending').length;
        const totalRevenue = data.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
            totalOrders,
            pendingOrders,
            totalRevenue,
            avgOrderValue
        });
    };

    const fetchSales = useCallback(async () => {
        try {
            const res = await axios.get('/api/orders/sales');
            setSales(res.data);
            calculateStats(res.data);
        } catch (err) {
            console.error('Failed to fetch sales', err);
            toast.error('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const handleStatusChange = async (orderId, newStatus) => {
        const originalSales = [...sales];
        // Optimistic update
        const updatedSales = sales.map(sale => sale._id === orderId ? { ...sale, status: newStatus } : sale);
        setSales(updatedSales);
        calculateStats(updatedSales);

        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
        } catch (err) {
            setSales(originalSales); // Revert on failure
            calculateStats(originalSales);
            toast.error('Failed to update status.');
        }
    };

    const filteredSales = sales.filter(sale => {
        const matchesStatus = filterStatus === 'All' || sale.status === filterStatus;
        const matchesSearch = searchTerm === '' ||
            sale._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sale.user?.name && sale.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const statusOptions = ['All', 'Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading) return (
        <div className="page-wrapper">
            <h1 className="mb-5">Manage Customer Orders</h1>
            <div className="flex-center p-10">Loading orders...</div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <div className="mb-8">
                <h1 className="mb-3">Manage Customer Orders</h1>
                <p className="text-muted">View and manage all incoming orders from customers.</p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon="📦"
                    color="primary"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon="⏳"
                    color="warning"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon="💰"
                    color="success"
                />
                <StatsCard
                    title="Avg. Order Value"
                    value={`₹${stats.avgOrderValue.toFixed(0)}`}
                    icon="📈"
                    color="info"
                />
            </div>

            {/* Controls: Filter & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 glass-panel p-4 rounded-xl">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {statusOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filterStatus === status
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105'
                                : 'bg-glass-bg text-text-primary hover:bg-glass-border'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="w-full md:w-1/3">
                    <SearchBar
                        onSearchSubmit={setSearchTerm}
                        placeholder="Search Order ID or Customer..."
                        initialValue={searchTerm}
                    />
                </div>
            </div>

            {/* Orders List */}
            <AnimatePresence>
                {filteredSales.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-center flex-col py-10 glass-panel rounded-xl"
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.3 }}>�</div>
                        <p className="text-xl text-muted">No orders found matching your criteria.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-6"
                    >
                        {filteredSales.map(order => (
                            <motion.div key={order._id} variants={itemVariants} layout>
                                <Card className="glass-panel overflow-hidden p-0 hover:shadow-xl transition-shadow duration-300 border border-glass">
                                    {/* Header */}
                                    <div className="p-5 border-b border-glass bg-glass-bg/50 flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-bold text-lg tracking-tight">
                                                    Order <span className="text-primary">#{order._id.slice(-6).toUpperCase()}</span>
                                                </h4>
                                                <span className={`badge ${order.status === 'Delivered' ? 'badge-success' :
                                                    order.status === 'Cancelled' ? 'badge-danger' :
                                                        order.status === 'In Transit' ? 'badge-info' :
                                                            'badge-warning'
                                                    } px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted flex items-center gap-2">
                                                <span>🗓️ {new Date(order.createdAt).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>👤 {order.user?.name || 'Unknown User'}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xs text-muted uppercase tracking-wider font-bold">Total Amount</p>
                                                <p className="font-bold text-2xl text-gradient">₹{order.totalAmount?.toFixed(2)}</p>
                                            </div>
                                            <div className="relative">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="appearance-none pl-4 pr-10 py-2 rounded-lg bg-glass-bg border border-glass text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-glass-border transition-colors"
                                                    style={{ color: 'var(--text-primary)' }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="In Transit">In Transit</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-5">
                                        <h5 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 border-b border-glass pb-2">Items Ordered</h5>
                                        <div className="grid gap-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-glass-bg/30 border border-glass/50 hover:bg-glass-bg/50 transition-colors">
                                                    <div className="w-16 h-16 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 shadow-sm relative group">
                                                        <img
                                                            src={item.imageUrl || 'https://placehold.co/100'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-lg">{item.name}</p>
                                                        <p className="text-sm text-muted">Qty: <span className="font-mono font-bold text-primary">{item.quantity}</span></p>
                                                    </div>
                                                    <div className="font-bold text-lg">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="p-4 bg-glass-bg/50 border-t border-glass flex justify-end">
                                        <a
                                            href={generateGoogleCalendarLink(order, 'Retailer')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-ghost text-primary hover:text-primary-dark flex items-center gap-2 no-underline transition-transform hover:scale-105"
                                        >
                                            📅 Add to Calendar
                                        </a>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderManagementPage;