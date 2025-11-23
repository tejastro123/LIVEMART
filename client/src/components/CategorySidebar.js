// client/src/components/CategorySidebar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from './ui/Card';

const CategorySidebar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CategorySidebar mounted - fetching categories');
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory) {
      navigate(`/category/${selectedCategory}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Card className="glass-panel p-4 h-fit">
      <h3 className="font-bold mb-3">Categories</h3>
      <select
        className="w-full p-2 rounded bg-glass border-glass text-main"
        onChange={handleCategoryChange}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }}
      >
        <option value="" style={{ background: '#1a1a1a' }}>All Products</option>
        {categories.map(category => (
          <option key={category} value={category} style={{ background: '#1a1a1a' }}>
            {category}
          </option>
        ))}
      </select>
    </Card>
  );
};

export default CategorySidebar;
