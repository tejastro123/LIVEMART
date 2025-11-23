// client/src/components/account/CustomerAccountPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import AccountHeader from './AccountHeader';
import AccountSection from './AccountSection';
import AccountStat from './AccountStat';
import ProductItem from '../ProductItem';
import SkeletonOrderCard from '../SkeletonOrderCard';
import SkeletonProductCard from '../SkeletonProductCard';
import Input from '../ui/Input';
import Button from '../ui/Button';

// --- Reusable Address Form Component ---
const AddressForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    addressLabel: initialData.addressLabel || '',
    street: initialData.street || '',
    city: initialData.city || '',
    postalCode: initialData.postalCode || '',
    country: initialData.country || '',
    isDefault: initialData.isDefault || false,
  });
  const { addressLabel, street, city, postalCode, country, isDefault } = formData;

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="grid gap-3">
      <Input placeholder="Label (e.g., Home)" name="addressLabel" value={addressLabel} onChange={onChange} />
      <Input placeholder="Street Address" name="street" value={street} onChange={onChange} required />
      <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input placeholder="City" name="city" value={city} onChange={onChange} required />
        <Input placeholder="Postal Code" name="postalCode" value={postalCode} onChange={onChange} required />
      </div>
      <Input placeholder="Country" name="country" value={country} onChange={onChange} required />
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="isDefault" checked={isDefault} onChange={onChange} style={{ accentColor: 'var(--primary-500)' }} />
        <span className="text-secondary">Set as default address</span>
      </label>
      <div className="flex gap-3 mt-2">
        <Button type="submit">Save Address</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
};

const CustomerAccountPage = () => {
  const { user, loadUser, wishlist } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingQueries, setLoadingQueries] = useState(true);
  const [loadingWishlist] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  // Calculate stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const pendingQueries = queries.filter(q => q.status !== 'Resolved' && q.status !== 'Closed').length;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get('/api/users/addresses');
        setAddresses(data);
      } catch (err) { console.error("Failed to fetch addresses"); }
    };
    fetchAddresses();

    const fetchUserData = async () => {
      setLoadingOrders(true);
      try {
        const orderRes = await axios.get('/api/orders/my-orders');
        setOrders(orderRes.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoadingOrders(false);
      }

      setLoadingQueries(true);
      try {
        const queryRes = await axios.get('/api/queries/my-queries');
        setQueries(queryRes.data);
      } catch (err) {
        console.error('Failed to fetch queries', err);
      } finally {
        setLoadingQueries(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleAddAddress = async (formData) => {
    try {
      const { data } = await axios.post('/api/users/addresses', formData);
      setAddresses(data);
      setShowAddForm(false);
      toast.success("Address added!");
    } catch (err) { toast.error("Failed to add address."); }
  };

  const handleUpdateAddress = async (formData) => {
    try {
      const { data } = await axios.put(`/api/users/addresses/${editingAddressId}`, formData);
      setAddresses(data);
      setEditingAddressId(null);
      toast.success("Address updated!");
    } catch (err) { toast.error("Failed to update address."); }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const { data } = await axios.delete(`/api/users/addresses/${addressId}`);
        setAddresses(data);
        toast.info("Address deleted.");
      } catch (err) { toast.error("Failed to delete address."); }
    }
  };

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
    { label: 'My Orders', to: '/my-orders', icon: '📦', variant: 'outline' },
    { label: `Cart (${wishlist.length})`, to: '/cart', icon: '🛒', variant: 'outline' }
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
          label="Total Spent"
          value={`₹${totalSpent.toLocaleString()}`}
          color="primary"
        />
        <AccountStat
          icon="📦"
          label="Total Orders"
          value={totalOrders}
          color="secondary"
          trend="up"
          trendValue="+12%"
        />
        <AccountStat
          icon="✨"
          label="Loyalty Points"
          value={user.loyaltyPoints || 0}
          color="accent"
        />
        <AccountStat
          icon="💬"
          label="Pending Queries"
          value={pendingQueries}
          color="primary"
        />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Left Column: Profile & Addresses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Profile Update */}
          <AccountSection title="Update Profile">
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <Input placeholder="Name" name="name" value={name} onChange={onChange} required />
              <Input placeholder="Email Address" name="email" value={email} onChange={onChange} required />
              <Input type="password" placeholder="New Password (leave blank)" name="password" value={password} onChange={onChange} />
              <Button type="submit" style={{ width: '100%' }}>Update Profile</Button>
            </form>
          </AccountSection>

          {/* Saved Addresses */}
          <AccountSection title="Saved Addresses">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {addresses.map(addr => (
                editingAddressId === addr._id ? (
                  <div key={addr._id} className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                    <AddressForm
                      initialData={addr}
                      onSubmit={handleUpdateAddress}
                      onCancel={() => setEditingAddressId(null)}
                    />
                  </div>
                ) : (
                  <div key={addr._id} className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: 'var(--space-1)' }} className="text-primary">
                      {addr.addressLabel || 'Address'}
                      {addr.isDefault && <span style={{ fontSize: '0.75rem', marginLeft: 'var(--space-2)' }} className="text-secondary-400">(Default)</span>}
                    </p>
                    <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-2)' }} className="text-secondary">
                      {addr.street}, {addr.city}, {addr.postalCode}, {addr.country}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                      <button onClick={() => setEditingAddressId(addr._id)} style={{ fontSize: '0.75rem' }} className="text-primary-400 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteAddress(addr._id)} style={{ fontSize: '0.75rem' }} className="text-red-400 hover:underline">Delete</button>
                    </div>
                  </div>
                )
              ))}
              {addresses.length === 0 && !showAddForm && <p style={{ fontSize: '0.875rem' }} className="text-tertiary">No addresses saved.</p>}
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
              {showAddForm ? (
                <div className="glass-card" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                  <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddForm(false)} />
                </div>
              ) : (
                <Button variant="outline" size="sm" style={{ width: '100%' }} onClick={() => setShowAddForm(true)}>
                  + Add New Address
                </Button>
              )}
            </div>
          </AccountSection>
        </div>

        {/* Right Column: Orders, Wishlist, Queries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Recent Orders */}
          <AccountSection title="Recent Orders" actionLabel="View All" actionLink="/my-orders">
            <div className="flex flex-col gap-3">
              {loadingOrders ? (
                Array.from({ length: 2 }).map((_, index) => <SkeletonOrderCard key={index} />)
              ) : orders.length === 0 ? (
                <p className="text-tertiary">You have not placed any orders yet.</p>
              ) : (
                orders.slice(0, 5).map(order => (
                  <div key={order._id} className="glass-card" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }} className="text-primary">Order #{order._id.slice(-6)}</h4>
                      <p style={{ fontSize: '0.75rem' }} className="text-tertiary">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.875rem' }} className="text-primary">₹{order.totalAmount?.toFixed(2)}</p>
                      <span style={{ fontSize: '0.75rem', padding: 'var(--space-1) var(--space-2)', borderRadius: '9999px' }} className={order.status === 'Delivered' ? 'bg-secondary-500/20 text-secondary-400' : 'bg-accent-500/20 text-accent-400'}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AccountSection>

          {/* Wishlist */}
          <AccountSection title="My Wishlist" actionLabel="View All" actionLink="/wishlist">
            {loadingWishlist ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, index) => <SkeletonProductCard key={index} />)}
              </div>
            ) : wishlist.length === 0 ? (
              <p className="text-tertiary">Your wishlist is empty.</p>
            ) : (
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                {wishlist.slice(0, 6).map(product => (
                  <ProductItem key={product._id} product={product} />
                ))}
              </div>
            )}
          </AccountSection>

          {/* Support Queries */}
          <AccountSection title="Support Queries" actionLabel="View All" actionLink="/my-queries">
            <div className="flex flex-col gap-3">
              {loadingQueries ? (
                <p className="text-tertiary">Loading queries...</p>
              ) : queries.length === 0 ? (
                <p className="text-tertiary">You have not submitted any queries.</p>
              ) : (
                queries.slice(0, 3).map(q => (
                  <div key={q._id} className="glass-card p-3 rounded-md">
                    <h4 className="font-bold text-sm mb-1 text-primary">{q.subject}</h4>
                    <div className="flex justify-between text-xs text-tertiary">
                      <span>To: {q.retailer?.name || 'Retailer'}</span>
                      <span className={q.status === 'Resolved' ? 'text-secondary-400' : 'text-accent-400'}>{q.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AccountSection>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccountPage;
