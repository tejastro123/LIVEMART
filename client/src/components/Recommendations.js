// client/src/components/Recommendations.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Recommendations = ({ productId }) => {
    const [recs, setRecs] = useState([]);

    useEffect(() => {
        const fetchRecs = async () => {
        if (productId) {
            try {
            const res = await axios.get(`/api/products/${productId}/recommendations`);
            setRecs(res.data);
            } catch (err) {
            console.error("Could not fetch recommendations.", err);
            }
        }
        };
        fetchRecs();
    }, [productId]);

    if (recs.length === 0) {
        return null; // Don't render anything if there are no recommendations
    }

    return (
        <div className="recommendations-section">
        <h3>Customers Also Bought</h3>
        <div className="product-grid">
            {recs.map(product => (
            <Link to={`/product/${product._id}`} key={product._id} className="product-card">
                {/* Add an image tag here later: <img src={product.imageUrl} alt={product.name} /> */}
                <h4>{product.name}</h4>
                <p>${product.price.toFixed(2)}</p>
            </Link>
            ))}
        </div>
        </div>
    );
};

export default Recommendations;