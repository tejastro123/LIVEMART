// client/src/components/CartPage.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Clock, Package, ShieldCheck } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import CartItemCard from './cart/CartItemCard';
import CouponInput from './cart/CouponInput';
import SavedItemsSection from './cart/SavedItemsSection';
import EmptyCartState from './cart/EmptyCartState';
import './CartPage.css';

const CartPage = () => {
    const { cart, savedItems, appliedCoupon, dispatch } = useContext(CartContext);

    const handleUpdateQuantity = (itemId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
        toast.success('Quantity updated', { autoClose: 1500 });
    };

    const handleRemoveItem = (itemId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: itemId } });
        toast.info('Item removed from cart');
    };

    const handleSaveForLater = (itemId) => {
        dispatch({ type: 'SAVE_FOR_LATER', payload: { id: itemId } });
        toast.success('Item saved for later');
    };

    const handleMoveToCart = (itemId) => {
        dispatch({ type: 'MOVE_TO_CART', payload: { id: itemId } });
        toast.success('Item moved to cart');
    };

    const handleRemoveFromSaved = (itemId) => {
        dispatch({ type: 'REMOVE_FROM_SAVED', payload: { id: itemId } });
        toast.info('Item removed from saved items');
    };

    const handleApplyCoupon = (coupon) => {
        dispatch({ type: 'APPLY_COUPON', payload: coupon });
        toast.success(`Coupon "${coupon.code}" applied!`, { autoClose: 2000 });
    };

    const handleRemoveCoupon = () => {
        dispatch({ type: 'REMOVE_COUPON' });
        toast.info('Coupon removed');
    };

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;

        const subtotal = calculateSubtotal();
        if (appliedCoupon.type === 'percentage') {
            return subtotal * appliedCoupon.discount / 100;
        } else if (appliedCoupon.type === 'fixed') {
            return Math.min(appliedCoupon.discount, subtotal);
        }
        return 0;
    };

    const calculateTax = () => {
        const subtotal = calculateSubtotal();
        const discount = calculateDiscount();
        return (subtotal - discount) * 0.08; // 8% tax
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const discount = calculateDiscount();
        const tax = calculateTax();
        return (subtotal - discount + tax).toFixed(2);
    };

    const getEstimatedDelivery = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    if (cart.length === 0 && savedItems.length === 0) {
        return <EmptyCartState />;
    }

    return (
        <div className="page-wrapper cart-page">
            <div className="cart-header">
                <h1 className="cart-title">Shopping Cart</h1>
                <p className="cart-subtitle">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>

            <div className="cart-layout">
                {/* Left Column: Cart Items */}
                <div className="cart-items-section">
                    {cart.length > 0 ? (
                        <>
                            {cart.map(item => (
                                <CartItemCard
                                    key={item._id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                    onSaveForLater={handleSaveForLater}
                                />
                            ))}
                        </>
                    ) : (
                        <Card className="glass-panel p-8 text-center">
                            <Package size={48} className="mx-auto mb-4 text-muted" />
                            <h3>All items saved for later</h3>
                            <p className="text-muted">Move items back to cart when you're ready to checkout</p>
                        </Card>
                    )}

                    {/* Saved Items */}
                    <SavedItemsSection
                        savedItems={savedItems}
                        onMoveToCart={handleMoveToCart}
                        onRemove={handleRemoveFromSaved}
                    />
                </div>

                {/* Right Column: Order Summary */}
                {cart.length > 0 && (
                    <div className="order-summary-wrapper">
                        <Card className="order-summary glass-panel sticky-top">
                            <h3 className="summary-title">Order Summary</h3>

                            {/* Coupon Input */}
                            <CouponInput
                                appliedCoupon={appliedCoupon}
                                onApplyCoupon={handleApplyCoupon}
                                onRemoveCoupon={handleRemoveCoupon}
                                cartTotal={calculateSubtotal()}
                            />

                            {/* Price Breakdown */}
                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span className="price-label">Subtotal</span>
                                    <span className="price-value">${calculateSubtotal().toFixed(2)}</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="price-row discount-row">
                                        <span className="price-label">Discount ({appliedCoupon.code})</span>
                                        <span className="price-value discount-value">-${calculateDiscount().toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="price-row">
                                    <span className="price-label">Tax (8%)</span>
                                    <span className="price-value">${calculateTax().toFixed(2)}</span>
                                </div>

                                <div className="price-row">
                                    <span className="price-label">Shipping</span>
                                    <span className="price-value free-shipping">Free</span>
                                </div>

                                <hr className="divider" />

                                <div className="price-row total-row">
                                    <span className="total-label">Total</span>
                                    <span className="total-value">${calculateTotal()}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Link to="/checkout" className="checkout-link">
                                <Button size="lg" className="checkout-btn">
                                    Proceed to Checkout
                                </Button>
                            </Link>

                            {/* Trust Badges */}
                            <div className="trust-badges">
                                <div className="trust-badge">
                                    <ShieldCheck size={20} />
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="trust-badge">
                                    <Clock size={20} />
                                    <span>Est. Delivery: {getEstimatedDelivery()}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;