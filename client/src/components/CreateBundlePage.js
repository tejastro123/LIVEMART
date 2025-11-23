import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateBundlePage = () => {
    const [name, setName] = useState('');
    const [myProducts, setMyProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        const fetchMyProducts = async () => {
        const { data } = await axios.get('/api/products/myproducts');
        setMyProducts(data);
        };
        fetchMyProducts();
    }, []);

    const handleProductSelect = (productId) => {
        setSelectedProducts(prev =>
        prev.includes(productId)
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await axios.post('/api/bundles', { name, products: selectedProducts });
        toast.success('Bundle created successfully!');
        } catch (err) {
        toast.error('Failed to create bundle.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Create a "Shop the Look" Bundle</h2>
        <input type="text" placeholder="Bundle Name (e.g., 'Modern Office Setup')" value={name} onChange={e => setName(e.target.value)} required />
        <h4>Select Products to Include:</h4>
        <div className="product-selection-grid">
            {myProducts && myProducts.map(p => (
            <div key={p._id} className={`product-selection-card ${selectedProducts.includes(p._id) ? 'selected' : ''}`} onClick={() => handleProductSelect(p._id)}>
                <img src={p.imageUrl || 'https://placehold.co/100'} alt={p.name} />
                <p>{p.name}</p>
            </div>
            ))}
        </div>
        <button type="submit">Create Bundle</button>
        </form>
    );
};

export default CreateBundlePage;