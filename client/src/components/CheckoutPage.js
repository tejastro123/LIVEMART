// client/src/components/CheckoutPage.js
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';

// Import new checkout components
import CheckoutProgress from './checkout/CheckoutProgress';
import ShippingStep from './checkout/ShippingStep';
import PaymentStep from './checkout/PaymentStep';
import GiftOptions from './checkout/GiftOptions';
import ReviewStep from './checkout/ReviewStep';
import OrderSummary from './checkout/OrderSummary';
import './checkout/CheckoutPage.css';

const CheckoutPage = () => {
    const { cart, appliedCoupon, dispatch } = useContext(CartContext);
    const { user, loadUser } = useAuthStore();
    const navigate = useNavigate();

    // Step Management
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Shipping State
    const [shippingAddress, setShippingAddress] = useState({
        address: '', city: '', postalCode: '', country: '',
    });
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [orderNotes, setOrderNotes] = useState('');

    // Guest Checkout State
    const [isGuest, setIsGuest] = useState(!user);
    const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [, setStoredPaymentMethod] = useState(null);

    // Gift Options State
    const [giftOptions, setGiftOptions] = useState({
        isGift: false,
        giftWrap: false,
        giftMessage: '',
        recipientName: ''
    });

    // Mobile summary expand state
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            toast.info('Your cart is empty');
            navigate('/');
        }
    }, [cart, navigate]);

    // Calculation Functions
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

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const discount = calculateDiscount();
        const pointsDiscount = pointsToRedeem / 10;

        // Get shipping cost
        const shippingCosts = { standard: 0, express: 9.99, overnight: 19.99 };
        const shippingCost = shippingCosts[shippingMethod] || 0;

        // Get gift wrap cost
        const giftWrapCost = giftOptions.giftWrap ? 5 : 0;

        const total = subtotal - discount - pointsDiscount + shippingCost + giftWrapCost;
        return Math.max(0, total).toFixed(2);
    };

    // Coupon Handlers
    const handleApplyCoupon = (coupon) => {
        dispatch({ type: 'APPLY_COUPON', payload: coupon });
        toast.success(`Coupon "${coupon.code}" applied!`, { autoClose: 2000 });
    };

    const handleRemoveCoupon = () => {
        dispatch({ type: 'REMOVE_COUPON' });
        toast.info('Coupon removed');
    };

    // Step Navigation
    const handleStepClick = (step) => {
        if (step < currentStep) {
            setCurrentStep(step);
        }
    };

    const handleContinueFromShipping = () => {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleContinueFromPayment = () => {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePaymentSuccess = async (paymentMethodObj) => {
        setStoredPaymentMethod(paymentMethodObj);
    };

    const handleEditStep = (step) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Place Order
    const placeOrder = async () => {
        const isWholesaleOrder = cart.some(item => item.isWholesale);

        if (!shippingAddress.address || !shippingAddress.city) {
            toast.error('Please complete shipping address');
            setCurrentStep(1);
            return;
        }

        setIsProcessing(true);

        try {
            if (isWholesaleOrder) {
                // Wholesale order
                const wholesaleItems = cart.map(item => ({
                    wholesalerId: item.retailer?._id || item.retailer,
                    productId: item._id,
                    quantity: item.quantity
                }));

                await axios.post('/api/wholesale-orders', { items: wholesaleItems });
                dispatch({ type: 'CLEAR_CART' });
                toast.success('Wholesale order placed successfully!');
                await loadUser();
                navigate('/wholesale-history');
            } else {
                // Standard customer order
                const orderData = {
                    orderItems: cart.map(item => ({
                        product: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        imageUrl: item.imageUrl,
                    })),
                    shippingAddress: shippingAddress,
                    totalAmount: parseFloat(calculateTotal()),
                    paymentMethod: paymentMethod,
                    pointsToRedeem,
                    shippingMethod,
                    orderNotes,
                    giftOptions: giftOptions.isGift ? giftOptions : null,
                };

                // Add guest info if guest checkout
                if (isGuest) {
                    orderData.guestInfo = guestInfo;
                }

                await axios.post('/api/orders', orderData);
                dispatch({ type: 'CLEAR_CART' });
                toast.success('Order placed successfully!');

                if (user) {
                    await loadUser();
                }

                // Show completion step
                setCurrentStep(4);

                // Redirect after a moment
                setTimeout(() => {
                    navigate(user ? '/my-orders' : '/');
                }, 3000);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || 'Failed to place order.');
            setIsProcessing(false);
        }
    };

    // Render current step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <ShippingStep
                            user={user}
                            shippingAddress={shippingAddress}
                            setShippingAddress={setShippingAddress}
                            shippingMethod={shippingMethod}
                            setShippingMethod={setShippingMethod}
                            orderNotes={orderNotes}
                            setOrderNotes={setOrderNotes}
                            isGuest={isGuest}
                            setIsGuest={setIsGuest}
                            guestInfo={guestInfo}
                            setGuestInfo={setGuestInfo}
                            onContinue={handleContinueFromShipping}
                        />
                        <GiftOptions
                            giftOptions={giftOptions}
                            setGiftOptions={setGiftOptions}
                        />
                    </>
                );
            case 2:
                return (
                    <PaymentStep
                        user={user}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        pointsToRedeem={pointsToRedeem}
                        setPointsToRedeem={setPointsToRedeem}
                        appliedCoupon={appliedCoupon}
                        onApplyCoupon={handleApplyCoupon}
                        onRemoveCoupon={handleRemoveCoupon}
                        cartTotal={calculateSubtotal()}
                        onContinue={handleContinueFromPayment}
                        onPaymentSuccess={handlePaymentSuccess}
                    />
                );
            case 3:
                return (
                    <ReviewStep
                        cart={cart}
                        shippingAddress={shippingAddress}
                        shippingMethod={shippingMethod}
                        paymentMethod={paymentMethod}
                        giftOptions={giftOptions}
                        orderNotes={orderNotes}
                        guestInfo={guestInfo}
                        isGuest={isGuest}
                        appliedCoupon={appliedCoupon}
                        pointsToRedeem={pointsToRedeem}
                        onEdit={handleEditStep}
                        onPlaceOrder={placeOrder}
                        isProcessing={isProcessing}
                        calculateSubtotal={calculateSubtotal}
                        calculateDiscount={calculateDiscount}
                        calculateTotal={calculateTotal}
                    />
                );
            case 4:
                return (
                    <div className="completion-step">
                        <div className="completion-content">
                            <div className="success-icon">✅</div>
                            <h2 className="completion-title">Order Placed Successfully!</h2>
                            <p className="completion-message">
                                Thank you for your order. {user ? 'You can track it in your orders page.' : 'You will receive a confirmation email shortly.'}
                            </p>
                            <div className="completion-animation">🎉</div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (cart.length === 0) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="page-wrapper checkout-page">
            <div className="checkout-container">
                <h1 className="checkout-main-title">Checkout</h1>

                {currentStep < 4 && (
                    <CheckoutProgress
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                    />
                )}

                <div className="checkout-layout">
                    {/* Main Content */}
                    <div className="checkout-main">
                        {renderStepContent()}
                    </div>

                    {/* Order Summary Sidebar */}
                    {currentStep < 4 && (
                        <div className="checkout-sidebar">
                            <OrderSummary
                                cart={cart}
                                shippingMethod={shippingMethod}
                                giftOptions={giftOptions}
                                appliedCoupon={appliedCoupon}
                                pointsToRedeem={pointsToRedeem}
                                calculateSubtotal={calculateSubtotal}
                                calculateDiscount={calculateDiscount}
                                calculateTotal={calculateTotal}
                                isExpanded={isSummaryExpanded}
                                setIsExpanded={setIsSummaryExpanded}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;