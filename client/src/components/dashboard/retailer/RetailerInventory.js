import React from 'react';
import { motion } from 'framer-motion';
import SkeletonLoader from '../../ui/SkeletonLoader';

const RetailerInventory = ({ products, loading, onEdit, onDelete, onAddNew }) => {
  return (
    <section className="dashboard-section">
      <div className="flex justify-between items-center mb-4">
        <h3>Current Inventory</h3>
        <button
          className="btn btn-sm btn-secondary"
          onClick={onAddNew}
        >
          + Add New
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonLoader type="card" height="80px" count={3} />
        </div>
      ) : (
        <div className="inventory-list">
          {products.length > 0 ? products.map(product => (
            <motion.div
              key={product._id}
              className="inventory-item"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-4">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="img-thumb"
                  />
                )}
                <div>
                  <div className="inventory-item-name">{product.name}</div>
                  <div className="text-sm text-tertiary">
                    Stock: {product.stock} | ₹{product.price}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-secondary" onClick={() => onEdit(product)}>Edit</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )) : (
            <p className="text-secondary text-center p-4">
              No products found. Add one below!
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default RetailerInventory;
