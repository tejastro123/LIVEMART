// client/src/components/account/RetailerAccountPage.js
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

const RetailerAccountPage = () => {
  const { user, loadUser } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  // Calculate stats
  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;
  const pendingQueries = queries.filter(q => q.status !== 'Closed' && q.status !== 'Resolved').length;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [productsRes, ordersRes, queriesRes] = await Promise.all([
          axios.get('/api/products/myproducts'),
          axios.get('/api/orders/sales'),
          axios.get('/api/queries/received-queries')
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setQueries(queriesRes.data);
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
    { label: '➕ Add Product', onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), variant: 'outline' }
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
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          color="secondary"
          trend="up"
          trendValue="+12%"
        />
        <AccountStat
          icon="📦"
          label="Total Orders"
          value={totalOrders}
          color="secondary"
          trend="up"
          trendValue="+5%"
        />
        <AccountStat
          icon="🏷️"
          label="Active Products"
          value={activeProducts}
          color="secondary"
        />
        <AccountStat
          icon="💬"
          label="Pending Queries"
          value={pendingQueries}
          color="secondary"
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

          {/* Account Information */}
          <AccountSection title="Account Information">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.75rem', marginBottom: 'var(--space-1)' }} className="text-tertiary">Account Type</p>
                <p style={{ fontWeight: 'bold' }} className="text-secondary-400">Retailer</p>
              </div>
              <div className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.75rem', marginBottom: 'var(--space-1)' }} className="text-tertiary">Member Since</p>
                <p style={{ fontWeight: 'bold' }} className="text-primary">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.75rem', marginBottom: 'var(--space-1)' }} className="text-tertiary">Total Products</p>
                <p style={{ fontWeight: 'bold' }} className="text-primary">{activeProducts}</p>
              </div>
            </div>
          </AccountSection>
        </div>

        {/* Right Column: Dashboard Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Inventory Preview */}
          <AccountSection title="Inventory Overview" actionLabel="View Full Dashboard" actionLink="/">
            {loading ? (
              <p className="text-tertiary">Loading inventory...</p>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-tertiary mb-4">No products in inventory.</p>
                <Link to="/">
                  <Button size="sm">Add Your First Product</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-3">
                {products.slice(0, 5).map(product => (
                  <div key={product._id} className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    )}
                    <div style={{ flex: '1' }}>
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }} className="text-primary">{product.name}</h4>
                      <p style={{ fontSize: '0.75rem' }} className="text-tertiary">Stock: {product.stock || 0} units</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.875rem' }} className="text-secondary-400">₹{product.price}</p>
                      <p style={{ fontSize: '0.75rem' }} className="text-tertiary">per unit</p>
                    </div>
                  </div>
                ))}
                {products.length > 5 && (
                  <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: 'var(--space-2)' }} className="text-tertiary">
                    +{products.length - 5} more products
                  </p>
                )}
              </div>
            )}
          </AccountSection>

          {/* Recent Orders */}
          <AccountSection title="Recent Orders" actionLabel="View Full Dashboard" actionLink="/">
            {loading ? (
              <p className="text-tertiary">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-tertiary">No orders yet.</p>
            ) : (
              <div className="grid gap-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order._id} className="glass-card p-3 rounded-md flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-primary">Order #{order._id.slice(-6)}</h4>
                      <p className="text-xs text-tertiary">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-secondary-400">₹{order.totalPrice?.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-secondary-500/20 text-secondary-400' : 'bg-accent-500/20 text-accent-400'}`}>
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

          {/* Customer Queries */}
          <AccountSection title="Customer Queries" actionLabel="View Full Dashboard" actionLink="/">
            {loading ? (
              <p className="text-tertiary">Loading queries...</p>
            ) : queries.length === 0 ? (
              <p className="text-tertiary">No customer queries.</p>
            ) : (
              <div className="grid gap-3">
                {queries.slice(0, 5).map(q => (
                  <div key={q._id} className="glass-card p-3 rounded-md">
                    <h4 className="font-bold text-sm mb-1 text-primary">{q.subject}</h4>
                    <div className="flex justify-between text-xs text-tertiary">
                      <span>From: {q.customer?.name || 'Customer'}</span>
                      <span className={q.status === 'Resolved' || q.status === 'Closed' ? 'text-secondary-400' : 'text-accent-400'}>
                        {q.status}
                      </span>
                    </div>
                  </div>
                ))}
                {queries.length > 5 && (
                  <p className="text-xs text-tertiary text-center mt-2">
                    +{queries.length - 5} more queries
                  </p>
                )}
              </div>
            )}
          </AccountSection>
        </div>
      </div>
    </div>
  );
};

export default RetailerAccountPage;
