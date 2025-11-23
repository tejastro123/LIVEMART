// client/src/components/MyOrdersPage.js
import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Package,
  Search,
  X,
  ChevronDown,
  Download,
  XCircle,
  CheckCircle,
  Clock,
  Truck,
  ShoppingBag
} from 'lucide-react';
import OrderProgressBar from './ui/OrderProgressBar';
import SkeletonOrderCard from './SkeletonOrderCard';
import Button from './ui/Button';
import './myorders.css';

const getDeliveryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const STATUS_FILTERS = [
  { value: 'All', label: 'All Orders' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Processing', label: 'Processing' },
  { value: 'In Transit', label: 'In Transit' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' }
];

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date (Newest First)' },
  { value: 'date-asc', label: 'Date (Oldest First)' },
  { value: 'amount-desc', label: 'Amount (High to Low)' },
  { value: 'amount-asc', label: 'Amount (Low to High)' }
];

const ITEMS_PER_PAGE = 10;

const MyOrdersPage = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewedOrderIds, setReviewedOrderIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/orders/my-orders');
        setOrders(res.data);
        const reviewedRes = await axios.get('/api/retailers/reviews/my-reviewed-orders');
        setReviewedOrderIds(reviewedRes.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Socket for real-time updates
  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('joinRoom', user._id);

    const handleStatusUpdate = (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      toast.info(`Order ${updatedOrder._id} status updated to ${updatedOrder.status}`);
    };

    socket.on('orderStatusUpdate', handleStatusUpdate);

    return () => {
      socket.off('orderStatusUpdate', handleStatusUpdate);
    };
  }, [socket, user]);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order =>
        order._id.toLowerCase().includes(query) ||
        order.items.some(item => item.name?.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-desc':
          return b.totalAmount - a.totalAmount;
        case 'amount-asc':
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      await axios.patch(`/api/orders/${orderToCancel}/cancel`);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderToCancel ? { ...order, status: 'Cancelled' } : order
        )
      );
      toast.success('Order cancelled successfully');
      setCancelModalOpen(false);
      setOrderToCancel(null);
    } catch (err) {
      console.error('Failed to cancel order', err);
      toast.error(err.response?.data?.msg || 'Failed to cancel order');
    }
  };

  const openCancelModal = (orderId) => {
    setOrderToCancel(orderId);
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setOrderToCancel(null);
  };

  const handleDownloadInvoice = (orderId) => {
    toast.info('Invoice download feature coming soon!');
    // Mock download functionality
    console.log('Downloading invoice for order:', orderId);
  };

  const getOrderImage = (order) => {
    if (order.items.length > 0 && order.items[0].product?.image) {
      return order.items[0].product.image;
    }
    return null;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock size={16} />;
      case 'Processing':
        return <Package size={16} />;
      case 'In Transit':
        return <Truck size={16} />;
      case 'Delivered':
        return <CheckCircle size={16} />;
      case 'Cancelled':
        return <XCircle size={16} />;
      default:
        return <ShoppingBag size={16} />;
    }
  };

  const canCancelOrder = (status) => {
    return status === 'Pending' || status === 'Processing';
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-header">
          <h1 className="my-orders-title">My Orders</h1>
          <p className="my-orders-subtitle">Loading your order history...</p>
        </div>
        <div className="orders-loading">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonOrderCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      {/* Page Header */}
      <div className="my-orders-header">
        <h1 className="my-orders-title">My Orders</h1>
        <p className="my-orders-subtitle">
          {filteredAndSortedOrders.length} {filteredAndSortedOrders.length === 1 ? 'order' : 'orders'}
          {searchQuery && ` matching "${searchQuery}"`}
          {statusFilter !== 'All' && ` with status: ${statusFilter}`}
        </p>
      </div>

      {/* Controls: Search, Filter, Sort */}
      <div className="orders-controls">
        {/* Search Bar */}
        <div className="orders-search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="orders-search-input"
            placeholder="Search by order ID or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="orders-filters">
          <div className="filter-group">
            {STATUS_FILTERS.map(filter => (
              <button
                key={filter.value}
                className={`filter-btn ${statusFilter === filter.value ? 'active' : ''}`}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {paginatedOrders.length === 0 ? (
        <div className="orders-empty-state">
          <Package className="empty-icon" size={120} />
          <h3>
            {searchQuery || statusFilter !== 'All'
              ? 'No orders found'
              : 'No orders yet'}
          </h3>
          <p>
            {searchQuery || statusFilter !== 'All'
              ? 'Try adjusting your filters or search query'
              : 'Start shopping to see your orders here'}
          </p>
          {!searchQuery && statusFilter === 'All' && (
            <Link to="/">
              <Button variant="primary" size="lg">
                Browse Products
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="orders-list">
          {paginatedOrders.map(order => {
            const isExpanded = expandedOrders.has(order._id);
            const isDelivered = order.status === 'Delivered';
            const isReviewed = reviewedOrderIds.includes(order._id.toString());
            const retailerId = order.items[0]?.product?.retailer;
            const orderImage = getOrderImage(order);

            return (
              <div key={order._id} className={`order-card ${isExpanded ? 'expanded' : ''}`}>
                {/* Order Card Header (Click to expand) */}
                <div className="order-card-header" onClick={() => toggleOrderExpansion(order._id)}>
                  <div className="order-card-main">
                    {/* Order Image */}
                    <div className="order-image-container">
                      {orderImage ? (
                        <img src={orderImage} alt="Order" />
                      ) : (
                        <div className="order-multiple-items">
                          <Package size={32} />
                        </div>
                      )}
                    </div>

                    {/* Order Info */}
                    <div className="order-info">
                      <div className="order-id">
                        Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                      </div>
                      <div className="order-date">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="order-items-summary">
                        <strong>{order.items.length}</strong> {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                      <div className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>

                    {/* Order Meta */}
                    <div className="order-meta">
                      <div className="order-amount">${order.totalAmount.toFixed(2)}</div>
                      <ChevronDown className="expand-icon" size={24} />
                    </div>
                  </div>
                </div>

                {/* Expandable Order Details */}
                <div className="order-details">
                  <div className="order-details-content">
                    {/* Order Progress */}
                    <div className="order-progress-section">
                      <h4>Order Status</h4>
                      <OrderProgressBar status={order.status} />
                    </div>

                    {/* Order Items */}
                    <div className="order-items-list">
                      <h4>Order Items</h4>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Delivery Info */}
                    <div className="delivery-info">
                      <h4>Delivery Information</h4>
                      <p>
                        <strong>Estimated Delivery:</strong>
                        {isDelivered ? 'Delivered' : getDeliveryDate()}
                      </p>
                      {order.shippingAddress && (
                        <p>
                          <strong>Address:</strong>
                          {order.shippingAddress}
                        </p>
                      )}
                    </div>

                    {/* Order Actions */}
                    <div className="order-actions">
                      {canCancelOrder(order.status) && (
                        <button
                          className="action-btn danger"
                          onClick={() => openCancelModal(order._id)}
                        >
                          <XCircle size={18} />
                          Cancel Order
                        </button>
                      )}

                      {isDelivered && !isReviewed && retailerId && (
                        <Link to={`/review-seller/${order._id}/${retailerId}`}>
                          <button className="action-btn primary">
                            Review Seller
                          </button>
                        </Link>
                      )}

                      {isDelivered && isReviewed && (
                        <div className="already-reviewed">
                          <CheckCircle size={16} />
                          You've already reviewed this seller
                        </div>
                      )}

                      {isDelivered && (
                        <button
                          className="action-btn secondary"
                          onClick={() => handleDownloadInvoice(order._id)}
                        >
                          <Download size={18} />
                          Download Invoice
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="orders-pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="cancel-modal-overlay" onClick={closeCancelModal}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Order?</h3>
            <p>
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="cancel-modal-actions">
              <Button variant="secondary" onClick={closeCancelModal}>
                Keep Order
              </Button>
              <Button variant="danger" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
