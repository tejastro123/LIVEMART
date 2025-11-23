// client/src/components/account/WholesalerAccountPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import AccountHeader from './AccountHeader';
import AccountSection from './AccountSection';
import AccountStat from './AccountStat';
import Input from '../ui/Input';
import Button from '../ui/Button';

const WholesalerAccountPage = () => {
  const { user, loadUser } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  // Calculate stats
  const totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const activeListings = products.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const totalOrders = orders.length;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get('/api/products/myproducts'),
          axios.get('/api/wholesale-orders/my-sales')
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const { name, email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', formData);
      toast.success('Profile updated successfully!');
      loadUser();
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  if (!user) {
    return <p className="text-center py-10">Loading profile...</p>;
  }

  const quickActions = [
    { label: '📊 View Dashboard', to: '/', variant: 'primary' },
    { label: '📦 Bulk Orders', to: '/wholesale-history', variant: 'outline' }
  ];

  return (
    <div className="page-wrapper" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <AccountHeader user={user} quickActions={quickActions} />
      </div>

      {/* Stats Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <AccountStat
          icon="💰"
          label="Total Sales"
          value={`₹${totalSales.toLocaleString()}`}
          color="accent"
          trend="up"
          trendValue="+18%"
        />
        <AccountStat
          icon="📦"
          label="Active Listings"
          value={activeListings}
          color="accent"
        />
        <AccountStat
          icon="⏳"
          label="Pending Orders"
          value={pendingOrders}
          color="accent"
        />
        <AccountStat
          icon="📊"
          label="Total Orders"
          value={totalOrders}
          color="accent"
          trend="up"
          trendValue="+22%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Left Column: Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Profile Update */}
          <AccountSection title="Business Profile">
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <Input placeholder="Business Name" name="name" value={name} onChange={onChange} required />
              <Input placeholder="Email Address" name="email" value={email} onChange={onChange} required />
              <Input type="password" placeholder="New Password (leave blank)" name="password" value={password} onChange={onChange} />
              <Button type="submit" style={{ width: '100%' }}>Update Profile</Button>
            </form>
          </AccountSection>

          {/* Business Info */}
          <AccountSection title="Account Information">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.75rem', marginBottom: 'var(--space-1)' }} className="text-tertiary">Account Type</p>
                <p style={{ fontWeight: 'bold' }} className="text-accent-400">Wholesaler</p>
              </div>
              <div className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.75rem', marginBottom: 'var(--space-1)' }} className="text-tertiary">Member Since</p>
                <p style={{ fontWeight: 'bold' }} className="text-primary">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--space-md)' }}>
                <p style={{ fontSize: '0.75rem', marginBottom: 'var(--space-1)' }} className="text-tertiary">Total Listings</p>
                <p style={{ fontWeight: 'bold' }} className="text-primary">{activeListings}</p>
              </div>
              <div className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.75rem', marginBottom: 'var(--space-1)' }} className="text-tertiary">Retailer Partners</p>
                <p style={{ fontWeight: 'bold' }} className="text-primary">{new Set(orders.map(o => o.retailer?._id).filter(Boolean)).size}</p>
              </div>
            </div>
          </AccountSection>
        </div>

        {/* Right Column: Dashboard Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Catalog Preview */}
          <AccountSection title="Product Catalog" actionLabel="View Full Dashboard" actionLink="/">
            {loading ? (
              <p className="text-tertiary">Loading catalog...</p>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-tertiary mb-4">No products in catalog.</p>
                <Link to="/">
                  <Button size="sm">Add Your First Product</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-3">
                {products.slice(0, 5).map(product => (
                  <div key={product._id} className="glass-card p-3 rounded-md flex items-center gap-3">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-primary">{product.name}</h4>
                      <p className="text-xs text-tertiary">Stock: {product.stock || 0} units</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-accent-400">₹{product.price}</p>
                      <p className="text-xs text-tertiary">per unit</p>
                    </div>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-xs text-tertiary text-center mt-2">
                    +{products.length - 5} more products
                  </p>
                )}
              </div>
            )}
          </AccountSection>

          {/* Bulk Orders */}
          <AccountSection title="Recent Bulk Orders" actionLabel="View All Orders" actionLink="/wholesale-history">
            {loading ? (
              <p className="text-tertiary">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-tertiary">No bulk orders yet.</p>
            ) : (
              <div className="grid gap-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order._id} className="glass-card p-3 rounded-md flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-primary">Order #{order._id.slice(-6)}</h4>
                      <p className="text-xs text-tertiary">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.product?.name || 'Product'} x {order.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-accent-400">₹{order.totalPrice?.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Fulfilled' ? 'bg-secondary-500/20 text-secondary-400' :
                        order.status === 'Pending' ? 'bg-accent-500/20 text-accent-400' :
                          'bg-primary-500/20 text-primary-400'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length > 5 && (
                  <p className="text-xs text-tertiary text-center mt-2">
                    +{orders.length - 5} more orders
                  </p>
                )}
              </div>
            )}
          </AccountSection>

          {/* Top Retailers */}
          <AccountSection title="Retailer Partners">
            {loading ? (
              <p className="text-tertiary">Loading partners...</p>
            ) : orders.length === 0 ? (
              <p className="text-tertiary">No retailer partnerships yet.</p>
            ) : (
              <div className="grid gap-3">
                {/* Group orders by retailer and calculate totals */}
                {Object.entries(
                  orders.reduce((acc, order) => {
                    const retailerId = order.retailer?._id || 'unknown';
                    const retailerName = order.retailer?.name || 'Unknown Retailer';
                    if (!acc[retailerId]) {
                      acc[retailerId] = { name: retailerName, totalSpent: 0, orderCount: 0 };
                    }
                    acc[retailerId].totalSpent += order.totalPrice || 0;
                    acc[retailerId].orderCount += 1;
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1].totalSpent - a[1].totalSpent)
                  .slice(0, 5)
                  .map(([retailerId, data]) => (
                    <div key={retailerId} className="glass-card p-3 rounded-md flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-primary">{data.name}</h4>
                        <p className="text-xs text-tertiary">{data.orderCount} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-accent-400">₹{data.totalSpent.toLocaleString()}</p>
                        <p className="text-xs text-tertiary">total</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </AccountSection>
        </div>
      </div>
    </div>
  );
};

export default WholesalerAccountPage;
