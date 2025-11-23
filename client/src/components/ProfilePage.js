// client/src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import ProductItem from './ProductItem';
import SkeletonOrderCard from './SkeletonOrderCard';
import SkeletonProductCard from './SkeletonProductCard';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

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
            <div className="grid grid-cols-2 gap-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input placeholder="City" name="city" value={city} onChange={onChange} required />
                <Input placeholder="Postal Code" name="postalCode" value={postalCode} onChange={onChange} required />
            </div>
            <Input placeholder="Country" name="country" value={country} onChange={onChange} required />
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isDefault" checked={isDefault} onChange={onChange} style={{ accentColor: 'var(--primary)' }} />
                <span className="text-muted">Set as default address</span>
            </label>
            <div className="flex gap-3 mt-2">
                <Button type="submit">Save Address</Button>
                {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
            </div>
        </form>
    );
};

const ProfilePage = () => {
    const { user, loadUser, wishlist } = useAuthStore();
    const itemCount = wishlist.length;
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
    });

    const [orders, setOrders] = useState([]);
    const [queries, setQueries] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingQueries, setLoadingQueries] = useState(true);
    const [loadingWishlist,] = useState(false);

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

    return (
        <div className="page-wrapper">
            <div className="flex-between mb-5">
                <h1 className="text-3xl font-bold">My Account</h1>
                {user.role === 'customer' && (
                    <div className="flex gap-3">
                        <Link to="/my-orders"><Button variant="outline" size="sm">My Orders</Button></Link>
                        <Link to="/cart"><Button variant="outline" size="sm">Cart ({itemCount})</Button></Link>
                    </div>
                )}
            </div>

            <div className="grid-responsive" style={{ gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-xl)', alignItems: 'start' }}>

                {/* Left Column: Profile & Addresses */}
                <div className="flex flex-col gap-5">
                    <Card className="glass-panel p-5">
                        <div className="text-center mb-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-3 flex-center text-2xl font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-xl font-bold">{user.name}</h3>
                            <p className="text-muted">{user.email}</p>
                            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-glass border-glass text-sm">
                                <span className="text-primary font-bold">{user.loyaltyPoints || 0}</span> Loyalty Points
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className="grid gap-3">
                            <h4 className="font-bold mb-2 border-b border-glass pb-2">Update Details</h4>
                            <Input placeholder="Name" name="name" value={name} onChange={onChange} required />
                            <Input placeholder="Email Address" name="email" value={email} onChange={onChange} required />
                            <Input type="password" placeholder="New Password (leave blank)" name="password" value={password} onChange={onChange} />
                            <Button type="submit" className="w-full">Update Profile</Button>
                        </form>
                    </Card>

                    <Card className="glass-panel p-5">
                        <h3 className="font-bold mb-4 border-b border-glass pb-2">Saved Addresses</h3>
                        <div className="flex flex-col gap-3">
                            {addresses.map(addr => (
                                editingAddressId === addr._id ? (
                                    <Card key={addr._id} className="glass-card p-3">
                                        <AddressForm
                                            initialData={addr}
                                            onSubmit={handleUpdateAddress}
                                            onCancel={() => setEditingAddressId(null)}
                                        />
                                    </Card>
                                ) : (
                                    <div key={addr._id} className="glass-card p-3 relative group">
                                        <p className="font-bold mb-1">{addr.addressLabel || 'Address'} {addr.isDefault && <span className="text-xs text-success ml-2">(Default)</span>}</p>
                                        <p className="text-sm text-muted mb-2">{addr.street}, {addr.city}, {addr.postalCode}, {addr.country}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => setEditingAddressId(addr._id)} className="text-xs text-primary hover:underline">Edit</button>
                                            <button onClick={() => handleDeleteAddress(addr._id)} className="text-xs text-danger hover:underline">Delete</button>
                                        </div>
                                    </div>
                                )
                            ))}
                            {addresses.length === 0 && !showAddForm && <p className="text-muted text-sm">No addresses saved.</p>}
                        </div>

                        <div className="mt-4">
                            {showAddForm ? (
                                <Card className="glass-card p-3">
                                    <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddForm(false)} />
                                </Card>
                            ) : (
                                <Button variant="outline" size="sm" className="w-full" onClick={() => setShowAddForm(true)}>+ Add New Address</Button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Orders, Wishlist, Queries */}
                <div className="flex flex-col gap-5">

                    {/* Order History */}
                    <Card className="glass-panel p-5">
                        <div className="flex-between mb-4 border-b border-glass pb-2">
                            <h3 className="font-bold">Recent Orders</h3>
                            <Link to="/my-orders" className="text-sm text-primary hover:underline">View All</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            {loadingOrders ? (
                                Array.from({ length: 2 }).map((_, index) => <SkeletonOrderCard key={index} />)
                            ) : orders.length === 0 ? (
                                <p className="text-muted">You have not placed any orders yet.</p>
                            ) : (
                                orders.slice(0, 3).map(order => (
                                    <div key={order._id} className="glass-card p-3 flex-between">
                                        <div>
                                            <h4 className="font-bold text-sm">Order #{order._id.slice(-6)}</h4>
                                            <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">${order.totalAmount?.toFixed(2)}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Wishlist */}
                    <Card className="glass-panel p-5">
                        <div className="flex-between mb-4 border-b border-glass pb-2">
                            <h3 className="font-bold">My Wishlist</h3>
                            <Link to="/wishlist" className="text-sm text-primary hover:underline">View All</Link>
                        </div>
                        {loadingWishlist ? (
                            <div className="grid grid-cols-2 gap-3">
                                {Array.from({ length: 2 }).map((_, index) => <SkeletonProductCard key={index} />)}
                            </div>
                        ) : wishlist.length === 0 ? (
                            <p className="text-muted">Your wishlist is empty.</p>
                        ) : (
                            <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                                {wishlist.slice(0, 4).map(product => (
                                    <ProductItem key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Queries */}
                    <Card className="glass-panel p-5">
                        <div className="flex-between mb-4 border-b border-glass pb-2">
                            <h3 className="font-bold">Support Queries</h3>
                            <Link to="/my-queries" className="text-sm text-primary hover:underline">View All</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            {loadingQueries ? (
                                <p className="text-muted">Loading queries...</p>
                            ) : queries.length === 0 ? (
                                <p className="text-muted">You have not submitted any queries.</p>
                            ) : (
                                queries.slice(0, 3).map(q => (
                                    <div key={q._id} className="glass-card p-3">
                                        <h4 className="font-bold text-sm mb-1">{q.subject}</h4>
                                        <div className="flex-between text-xs text-muted">
                                            <span>To: {q.retailer?.name || 'Retailer'}</span>
                                            <span className={q.status === 'Resolved' ? 'text-success' : 'text-warning'}>{q.status}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;