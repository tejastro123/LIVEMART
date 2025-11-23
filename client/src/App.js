// client/src/App.js
import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import setAuthToken from './utils/setAuthToken';
import './App.css';
import GoogleCallbackHandler from './components/GoogleCallbackHandler';
import AuthSuccess from './components/AuthSuccess';
import PageLoader from './components/PageLoader';
import useAuthStore from './store/useAuthStore';
import ComparisonTray from './components/ComparisonTray';
import AIChatWidget from './components/AIChatWidget';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- Lazy-load all page-level components ---
const HomePage = React.lazy(() => import('./components/HomePage'));
const AuthPage = React.lazy(() => import('./components/AuthPage'));
const RetailerDashboard = React.lazy(() => import('./components/RetailerDashboard'));
const WholesalerDashboard = React.lazy(() => import('./components/WholesalerDashboard'));
const CartPage = React.lazy(() => import('./components/CartPage'));
const CheckoutPage = React.lazy(() => import('./components/CheckoutPage'));
const MyOrdersPage = React.lazy(() => import('./components/MyOrdersPage'));
const ProductPage = React.lazy(() => import('./components/ProductPage'));
const UpdateLocationPage = React.lazy(() => import('./components/UpdateLocationPage'));
const BrowseWholesalePage = React.lazy(() => import('./components/BrowseWholesalePage'));
const WholesalePurchaseHistory = React.lazy(() => import('./components/WholesalePurchaseHistory'));
const NearbyProductsPage = React.lazy(() => import('./components/NearbyProductsPage'));
const CreateQueryPage = React.lazy(() => import('./components/CreateQueryPage'));
const MyQueriesPage = React.lazy(() => import('./components/MyQueriesPage'));
const Verify2FA = React.lazy(() => import('./components/Verify2FA'));
const OrderManagementPage = React.lazy(() => import('./components/OrderManagementPage'));
const WishlistPage = React.lazy(() => import('./components/WishlistPage'));
const ComparePage = React.lazy(() => import('./components/ComparePage'));
const ContactPage = React.lazy(() => import('./components/ContactPage'));
const FAQPage = React.lazy(() => import('./components/FAQPage'));
const RetailerProfilePage = React.lazy(() => import('./components/RetailerProfilePage'));
const ReviewSellerPage = React.lazy(() => import('./components/ReviewSellerPage'));

// Role-based Account Pages
const CustomerAccountPage = React.lazy(() => import('./components/account/CustomerAccountPage'));
const RetailerAccountPage = React.lazy(() => import('./components/account/RetailerAccountPage'));
const WholesalerAccountPage = React.lazy(() => import('./components/account/WholesalerAccountPage'));

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const { user, loading } = useAuthStore();
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <Router>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Suspense fallback={<PageLoader />}>
        {user ? (
          <div className="app-wrapper">
            <Navbar />
            <motion.div
              className="main-content"
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container">
                <Routes>
                  <Route
                    path="/"
                    element={(() => {
                      if (user.role?.trim().toLowerCase() === 'retailer') {
                        return <RetailerDashboard />;
                      }
                      if (user.role?.trim().toLowerCase() === 'wholesaler') {
                        return <WholesalerDashboard />;
                      }
                      return <HomePage />;
                    })()}
                  />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/category/:categoryName" element={<HomePage />} />
                  <Route path="/browse-wholesale" element={<BrowseWholesalePage />} />
                  <Route path="/product/:id" element={<ProductPage user={user} />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/my-orders" element={<MyOrdersPage user={user} />} />
                  <Route path="/manage-orders" element={<OrderManagementPage />} />
                  <Route path="/wholesale-history" element={<WholesalePurchaseHistory />} />
                  <Route path="/raise-query" element={<CreateQueryPage />} />
                  <Route path="/my-queries" element={<MyQueriesPage user={user} />} />
                  <Route path="/nearby-products" element={<NearbyProductsPage />} />
                  <Route path="/update-location" element={<UpdateLocationPage user={user} loadUser={loadUser} />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/google/success" element={<GoogleCallbackHandler loadUser={loadUser} />} />
                  <Route
                    path="/profile"
                    element={(() => {
                      if (user.role?.trim().toLowerCase() === 'retailer') {
                        return <RetailerAccountPage />;
                      }
                      if (user.role?.trim().toLowerCase() === 'wholesaler') {
                        return <WholesalerAccountPage />;
                      }
                      return <CustomerAccountPage />;
                    })()}
                  />
                  <Route path="/auth/success" element={<AuthSuccess loadUser={loadUser} />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/retailer/:id" element={<RetailerProfilePage />} />
                  <Route path="/review-seller/:orderId/:retailerId" element={<ReviewSellerPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
              <AIChatWidget />
            </motion.div>
            <Footer />
            {user && <ComparisonTray />}
          </div>
        ) : (
          <motion.div>
            <Routes>
              <Route path="/verify-2fa" element={<Verify2FA loadUser={loadUser} />} />
              <Route path="*" element={<AuthPage loadUser={loadUser} />} />
            </Routes>
          </motion.div>
        )}
      </Suspense>
    </Router>
  );
};

export default App;