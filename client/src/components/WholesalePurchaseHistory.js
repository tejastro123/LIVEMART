// client/src/components/WholesalePurchaseHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import OrderProgressBar from './ui/OrderProgressBar';

const WholesalePurchaseHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const res = await axios.get('/api/wholesale-orders/my-purchases');
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching purchases:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    if (loading) return (
        <div className="page-wrapper">
            <h1 className="mb-5">Wholesale Purchase History</h1>
            <div className="flex-center p-10">Loading...</div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <div className="mb-8">
                <h1 className="mb-3">Wholesale Purchase History</h1>
                <p className="text-muted">Track your bulk orders from wholesalers.</p>
            </div>

            {orders.length === 0 ? (
                <div className="flex-center flex-col py-10 glass-panel rounded-xl">
                    <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}>🚚</div>
                    <p className="text-xl text-muted mb-4">You have not made any wholesale purchases yet.</p>
                    <Link to="/browse-wholesale">
                        <Button variant="primary">Browse Wholesale Products</Button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders.map(order => {
                        const isDelivered = order.status === 'Delivered' || order.status === 'Fulfilled';
                        const isCancelled = order.status === 'Cancelled';

                        return (
                            <Card key={order._id} className="glass-panel p-0 overflow-hidden">
                                {/* Header */}
                                <div className="p-5 border-b border-glass bg-glass-bg flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-lg">Order #{order._id.slice(-6).toUpperCase()}</h4>
                                            <span className={`badge ${isDelivered ? 'badge-success' :
                                                isCancelled ? 'badge-danger' :
                                                    'badge-warning'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted">Total Cost</p>
                                        <p className="font-bold text-xl">₹{order.totalPrice?.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {!isCancelled && !isDelivered && (
                                    <div className="px-5 pt-5">
                                        <OrderProgressBar status={order.status === 'Fulfilled' ? 'Delivered' : order.status} />
                                    </div>
                                )}

                                {/* Items */}
                                <div className="p-5">
                                    <h5 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">Items</h5>
                                    <div className="glass-card p-4 flex flex-wrap gap-4 items-center rounded-lg border border-glass">
                                        <div className="w-16 h-16 rounded-md bg-gray-700 overflow-hidden flex-shrink-0">
                                            {/* Placeholder image since wholesale order might not populate full product details deeply */}
                                            <img
                                                src={order.product?.imageUrl || 'https://placehold.co/100'}
                                                alt={order.product?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-medium text-lg block">{order.product?.name || 'Unknown Product'}</span>
                                            <div className="text-sm text-muted mt-1">
                                                Wholesaler: <span className="text-primary">{order.wholesaler?.name || 'Unknown'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg">x{order.quantity}</div>
                                            <div className="text-sm text-muted">Units</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 bg-glass-bg border-t border-glass flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-muted">Order ID: <span className="font-mono text-xs">{order._id}</span></p>
                                    </div>
                                    {order.status === 'Pending' && (
                                        <div className="text-sm text-warning font-medium flex items-center gap-2">
                                            ⏳ Awaiting Wholesaler Approval
                                        </div>
                                    )}
                                    {isDelivered && (
                                        <Button size="sm" variant="outline">
                                            Review Wholesaler
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default WholesalePurchaseHistory;