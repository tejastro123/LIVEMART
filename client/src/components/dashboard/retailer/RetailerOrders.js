import React from 'react';

const RetailerOrders = ({ orders, onStatusUpdate }) => {
  return (
    <section className="dashboard-section">
      <h3>Incoming Orders</h3>
      <div className="inventory-list">
        {orders.length > 0 ? orders.map(order => (
          <div key={order._id} className="inventory-item">
            <div>
              <span className="font-semibold text-primary-400">#{order._id.slice(-6)}</span>
              <div className="text-sm text-secondary">
                {order.user?.name || 'Deleted User'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={order.status}
                onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                className="text-sm p-1 rounded-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )) : (
          <p className="text-secondary text-center p-4">
            No orders yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default RetailerOrders;
