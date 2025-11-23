// client/src/components/ProductForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductForm = ({ onProductAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    isLocalSpecialty: false,
    imageUrl: '',
    discountPrice: '',
    isOnSale: false,
  });

  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { name, description, category, price, stock, discountPrice, isOnSale } = formData;

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);
      setImageUrl(data.secure_url);
      setUploading(false);
      setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Image upload failed');
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };
    try {
      const res = await axios.post('/api/products', formData, config);
      onProductAdd(res.data);
      toast.success('Product Added Successfully!');
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        isLocalSpecialty: false,
        imageUrl: '',
        discountPrice: '',
        isOnSale: false
      });
      setImageUrl('');
    } catch (err) {
      console.error(err.response?.data);
      toast.error('Error: Could not add product.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-panel" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
      <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>Add a New Product</h3>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Product Name</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Organic Honey"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Category</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Dairy"
            name="category"
            value={category}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Description</label>
        <textarea
          className="input-field"
          placeholder="Describe your product..."
          name="description"
          value={description}
          onChange={onChange}
          rows="3"
        />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Price (₹)</label>
          <input
            type="number"
            className="input-field"
            placeholder="0.00"
            name="price"
            value={price}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Stock Quantity</label>
          <input
            type="number"
            className="input-field"
            placeholder="0"
            name="stock"
            value={stock}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Product Image</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <input
            type="file"
            id="image-file"
            className="input-field"
            onChange={uploadFileHandler}
            style={{ padding: 'var(--space-2)' }}
          />
          {uploading && <span style={{ color: 'var(--text-tertiary)' }}>Uploading...</span>}
          {imageUrl && <span style={{ color: 'var(--secondary-400)' }}>✓ Uploaded</span>}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
        <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="isLocalSpecialty"
            checked={formData.isLocalSpecialty}
            onChange={e => setFormData({ ...formData, isLocalSpecialty: e.target.checked })}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-500)' }}
          />
          <span style={{ color: 'var(--text-primary)' }}>Local Specialty</span>
        </label>

        <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="isOnSale"
            checked={isOnSale}
            onChange={onChange}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-500)' }}
          />
          <span style={{ color: 'var(--text-primary)' }}>On Sale</span>
        </label>

        {isOnSale && (
          <div className="form-group">
            <input
              type="number"
              className="input-field"
              placeholder="Discount Price"
              name="discountPrice"
              value={discountPrice}
              onChange={onChange}
              required
              style={{ height: '36px' }}
            />
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-6)' }}>
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;
