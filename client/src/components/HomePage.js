// client/src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductList from './ProductList';
import ProductItem from './ProductItem';
import Countdown from './Countdown';
import Button from './ui/Button';
import CategorySidebar from './CategorySidebar';
import Input from './ui/Input';
import Card from './ui/Card';
import './HomePage.css';

// A component for displaying products in a horizontal scroll
const ProductCarousel = ({ title, products }) => {
  if (!products || products.length === 0) return null;
  return (
    <div className="homepage-section">
      <h2>{title}</h2>
      <div className="product-carousel">
        {products.map(product => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [deals, setDeals] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [, setAllProducts] = useState([]);
  const [forYouRecs, setForYouRecs] = useState([])

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sort: 'newest',
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sort: 'newest',
    });
  };

  useEffect(() => {
    console.log('HomePage mounted - fetching data');
    const fetchHomepageData = async () => {
      try {
        // Fetch products once and normalize response to an array
        const productsRes = await axios.get('/api/products');
        const productsArray = Array.isArray(productsRes.data)
          ? productsRes.data
          : (productsRes.data.products || []);

        const { data } = await axios.get('/api/products/flash-sale');
        setFlashSaleProducts(data);

        const dealsRes = await axios.get('/api/products/deals');
        setDeals(dealsRes.data);

        const bundlesRes = await axios.get('/api/bundles');
        setBundles(bundlesRes.data);

        setAllProducts(productsArray);
        setLocalProducts(productsArray.filter(p => p.isLocalSpecialty).slice(0, 5));

        if (localStorage.token) { // Only fetch if user is logged in
          const { data } = await axios.get('/api/products/recommendations/for-you');
          setForYouRecs(data);
        }
      } catch (err) {
        console.error("Failed to fetch homepage data", err);
        console.error("Failed to fetch flash sale data", err);
      }
    };
    fetchHomepageData();
  }, []);

  return (
    <div className="page-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Freshness Delivered to Your Doorstep</h1>
          <p className="hero-subtitle">Experience the premium quality of local specialties and daily essentials.</p>
          <Button size="lg" onClick={() => document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' })}>
            Shop Now
          </Button>
        </div>
        {/* Placeholder for Hero Image - can be replaced with actual image */}
        {/* <img src="/hero-image.png" alt="Fresh Food" className="hero-image" /> */}
      </section>

      {forYouRecs.length > 0 && (
        <ProductCarousel title="Just For You" products={forYouRecs} />
      )}

      <ProductCarousel title="Today's Deals" products={deals} />

      <ProductCarousel title="Local Specialties Near You" products={localProducts} />

      {flashSaleProducts.length > 0 && (
        <div className="homepage-section flash-sale-section">
          <h2>⚡ Flash Sale! Ends Soon!</h2>
          <div className="product-carousel">
            {flashSaleProducts.map(product => (
              <div key={product._id} className="product-card glass-card">
                <Link to={`/product/${product._id}`}>
                  <img src={product.imageUrl || 'https://placehold.co/400'} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
                  <h3>{product.name}</h3>
                  <div className="price-container">
                    <span className="discount-price">${product.flashSalePrice.toFixed(2)}</span>
                    <del className="original-price" style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>${product.price.toFixed(2)}</del>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <Countdown expiryDate={product.flashSaleExpires} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="home-layout">
        <aside className="sidebar-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <CategorySidebar />

          <Card className="glass-panel p-4">
            <h3 className="mb-3 font-bold">Filters</h3>
            <div className="filter-group mb-3">
              <Input
                label="Min Price"
                type="number"
                name="minPrice"
                placeholder="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <Input
                label="Max Price"
                type="number"
                name="maxPrice"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={filters.inStock}
                  onChange={handleFilterChange}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>In Stock Only</span>
              </label>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={resetFilters}>
              Reset Filters
            </Button>
          </Card>
        </aside>

        <main className="main-content">
          <ProductList
            externalFilters={filters}
            onFilterChange={handleFilterChange}
            showSidebar={false}
          />
        </main>
      </div>

      {bundles.length > 0 && (<div className="homepage-section">
        <h2>Shop the Look Bundles</h2>
        <div className="product-carousel">
          {bundles.map(bundle => (
            <div key={bundle._id} className="glass-card" style={{ minWidth: '300px' }}>
              <h3>{bundle.name}</h3>
              <div className="bundle-products" style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {bundle.products.map(product => (
                  <div key={product._id} style={{ minWidth: '100px' }}>
                    <img src={product.imageUrl || 'https://placehold.co/100'} alt={product.name} style={{ width: '100%', borderRadius: '4px' }} />
                    <p style={{ fontSize: '0.8rem' }}>{product.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>)}
    </div>
  );
};
export default HomePage;