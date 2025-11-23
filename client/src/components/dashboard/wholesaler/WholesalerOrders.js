import React from 'react';
import { motion } from 'framer-motion';

const WholesalerOrders = ({ orders, onStatusUpdate }) => {
  return (
    <section className="dashboard-section" style={{ position: 'sticky', top: 'var(--space-6)' }}>
      <h3>Incoming Retailer Orders</h3>
      <div className="inventory-list">
        {orders.length > 0 ? orders.map(order => (
          <motion.div
            key={order._id}
            className="inventory-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-2">
              <div className="font-semibold">
                {order.product?.name || 'Unknown Product'}
                <span className="text-tertiary"> (x{order.quantity})</span>
              </div>
              <div className="text-sm text-secondary">
                Retailer: {order.retailer?.name || 'Unknown'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={order.status}
                onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                className="w-full p-1 rounded-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </motion.div>
        )) : (
          <p className="text-secondary">No incoming orders.</p>
        )}
      </div>
    </section>
  );
};

export default WholesalerOrders;
