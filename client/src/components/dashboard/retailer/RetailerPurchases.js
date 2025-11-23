import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../ui/Card';
import { toast } from 'react-toastify';

const RetailerPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get('/api/wholesale-orders/my-purchases');
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching purchases:", err);
        toast.error("Failed to load purchase history.");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  if (loading) return <div className="text-center p-4">Loading purchases...</div>;

  return (
    <Card className="glass-panel p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🛍️</span> My Wholesale Purchases
      </h3>

      {orders.length === 0 ? (
        <p className="text-muted text-center py-4">No wholesale orders placed yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-muted text-sm border-b border-glass">
                <th className="p-3">Date</th>
                <th className="p-3">Product</th>
                <th className="p-3">Wholesaler</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-glass hover:bg-white/5 transition-colors">
                  <td className="p-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-medium">{order.product?.name || 'Unknown Product'}</td>
                  <td className="p-3 text-sm">{order.wholesaler?.name || 'Unknown'}</td>
                  <td className="p-3">{order.quantity}</td>
                  <td className="p-3 font-bold text-primary">₹{order.totalPrice?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Fulfilled' ? 'bg-success/20 text-success' :
                      order.status === 'Pending' ? 'bg-warning/20 text-warning' :
                        'bg-danger/20 text-danger'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default RetailerPurchases;
