// client/src/components/ProductEditModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ProductEditModal = ({ product, onClose, onProductUpdate }) => {
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        isLocalSpecialty: product.isLocalSpecialty || false,
        imageUrl: product.imageUrl || '',
        discountPrice: product.discountPrice || '',
        isOnSale: product.isOnSale || false,
        // flash sale fields
        isOnFlashSale: product.isOnFlashSale || false,
        flashSalePrice: product.flashSalePrice || '',
        flashSaleExpires: product.flashSaleExpires || '',
    });

    const [, setUploading] = useState(false);
    const { name, description, category, price, stock, imageUrl, discountPrice, isOnSale, isOnFlashSale, flashSalePrice, flashSaleExpires } = formData;

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue;
        if (type === 'checkbox') newValue = checked;
        else if (type === 'number') newValue = value === '' ? '' : parseFloat(value);
        else newValue = value;

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const fileFormData = new FormData();
        fileFormData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', fileFormData, config);
            setFormData({ ...formData, imageUrl: data.secure_url });
            setUploading(false);
        } catch (error) {
            console.error(error);
            toast.error('Image upload failed.');
            setUploading(false);
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.put(`/api/products/${product._id}`, formData);
            onProductUpdate(res.data);
            onClose();
            toast.success('Product updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            toast.error('Failed to update product.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="modal-header">
                    <h2 style={{ margin: 0 }}>Edit Product</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Name</label>
                            <input type="text" className="input-field" name="name" value={name} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Category</label>
                            <input type="text" className="input-field" name="category" value={category} onChange={onChange} required />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Description</label>
                        <textarea className="input-field" name="description" value={description} onChange={onChange} rows="3" />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Price</label>
                            <input type="number" className="input-field" name="price" value={price} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Stock</label>
                            <input type="number" className="input-field" name="stock" value={stock} onChange={onChange} required />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Image</label>
                        <div className="flex items-center gap-4">
                            <input type="file" className="input-field" onChange={uploadFileHandler} style={{ padding: 'var(--space-2)' }} />
                            {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />}
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

                        <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="isOnFlashSale"
                                checked={isOnFlashSale}
                                onChange={onChange}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-500)' }}
                            />
                            <span style={{ color: 'var(--text-primary)' }}>Flash Sale</span>
                        </label>
                    </div>

                    {(isOnSale || isOnFlashSale) && (
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                            {isOnSale && (
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem' }}>Discount Price</label>
                                    <input type="number" className="input-field" name="discountPrice" value={discountPrice} onChange={onChange} required />
                                </div>
                            )}
                            {isOnFlashSale && (
                                <>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem' }}>Flash Price</label>
                                        <input type="number" className="input-field" name="flashSalePrice" value={flashSalePrice} onChange={onChange} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem' }}>Expires At</label>
                                        <input type="datetime-local" className="input-field" name="flashSaleExpires" value={flashSaleExpires} onChange={onChange} />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProductEditModal;