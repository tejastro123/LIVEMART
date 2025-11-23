import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useCompareStore from '../store/useCompareStore';

const ComparisonTray = () => {
    const { items, removeFromCompare, clearCompare } = useCompareStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (items.length === 0) {
        return null; // Don't render if empty
    }

    return (
        <div className={`comparison-tray ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="tray-header">
                <h4>
                    <span className="compare-icon">⚖️</span>
                    Compare Items
                    <span className="item-count-badge">{items.length}/4</span>
                </h4>
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand" : "Collapse"}
                >
                    {isCollapsed ? '▲' : '▼'}
                </button>
            </div>

            {!isCollapsed && (
                <>
                    <div className="tray-items">
                        {items.map(item => (
                            <div key={item._id} className="tray-item">
                                <img
                                    src={item.imageUrl || 'https://placehold.jp/60x60.png'}
                                    alt={item.name}
                                    className="tray-item-image"
                                />
                                <div className="tray-item-details">
                                    <span className="tray-item-name">{item.name}</span>
                                    <span className="tray-item-price">${item.price?.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => removeFromCompare(item._id)}
                                    className="remove-btn"
                                    title="Remove from compare"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="tray-actions">
                        <Link to="/compare">
                            <button className="primary compare-now-btn">
                                🔍 Compare Now
                            </button>
                        </Link>
                        <button onClick={clearCompare} className="clear-btn">
                            🗑️ Clear All
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ComparisonTray;