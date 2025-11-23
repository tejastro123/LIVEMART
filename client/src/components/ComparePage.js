// client/src/components/ComparePage.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import useCompareStore from '../store/useCompareStore';

const ComparePage = () => {
	const { items: compareItems, removeFromCompare } = useCompareStore();
	const { dispatch } = useContext(CartContext);
	const [comparisonData, setComparisonData] = useState({ products: [], rows: [] });
	const [loading, setLoading] = useState(true);
	const [highlight, setHighlight] = useState(false);
	const [exporting, setExporting] = useState(false);
	const compareTableRef = useRef(null);

	useEffect(() => {
		const fetchCompareData = async () => {
			if (compareItems.length === 0) {
				setComparisonData({ products: [], rows: [] });
				setLoading(false);
				return;
			}
			setLoading(true);
			const ids = compareItems.map(item => item._id).join(',');
			try {
				const { data } = await axios.get(`/api/products/compare?ids=${ids}`);
				// Validate the response before setting state.
				if (data && data.products && data.rows) {
					setComparisonData(data);
				} else {
					console.error("API returned an invalid data structure:", data);
					setComparisonData({ products: [], rows: [] }); // Fallback to safe state
				}
			} catch (err) {
				console.error("Failed to fetch comparison data", err);
				setComparisonData({ products: [], rows: [] }); // Fallback on error
			} finally {
				setLoading(false);
			}
		};
		fetchCompareData();
	}, [compareItems]);

	// Determine winners for highlighting
	const getWinner = (row, products) => {
		if (row.feature === 'Price') {
			// Find minimum price
			const prices = products.map(p => {
				const priceStr = row.values[p._id.toString()];
				return parseFloat(priceStr.replace('$', ''));
			});
			const minPrice = Math.min(...prices);
			return products.find(p => {
				const priceStr = row.values[p._id.toString()];
				return parseFloat(priceStr.replace('$', '')) === minPrice;
			})?._id;
		} else if (row.feature === 'Rating') {
			// Find maximum rating
			const ratings = products.map(p => {
				const ratingStr = row.values[p._id.toString()];
				return parseFloat(ratingStr.split('/')[0]);
			});
			const maxRating = Math.max(...ratings);
			return products.find(p => {
				const ratingStr = row.values[p._id.toString()];
				return parseFloat(ratingStr.split('/')[0]) === maxRating;
			})?._id;
		} else if (row.feature === 'Stock') {
			// In Stock is better
			return products.find(p => row.values[p._id.toString()] === 'In Stock')?._id;
		}
		return null;
	};

	// Export as image
	const handleExport = async () => {
		if (!compareTableRef.current) return;

		setExporting(true);
		try {
			const canvas = await html2canvas(compareTableRef.current, {
				backgroundColor: '#0f172a',
				scale: 2,
			});

			const link = document.createElement('a');
			link.download = `product-comparison-${Date.now()}.png`;
			link.href = canvas.toDataURL();
			link.click();

			toast.success('Comparison exported successfully!', {
				position: 'bottom-right',
			});
		} catch (error) {
			console.error('Export failed:', error);
			toast.error('Failed to export comparison', {
				position: 'bottom-right',
			});
		} finally {
			setExporting(false);
		}
	};

	// Quick add to cart
	const handleAddToCart = (product) => {
		dispatch({
			type: 'ADD_TO_CART',
			payload: { ...product, quantity: 1 },
		});
		toast.success(`${product.name} added to cart!`, {
			position: 'bottom-right',
		});
	};

	if (loading) {
		return (
			<div className="compare-page-loading">
				<div className="loading-spinner"></div>
				<h2>Loading comparison...</h2>
			</div>
		);
	}

	const { products, rows } = comparisonData;

	if (products.length === 0) {
		return (
			<div className="compare-empty-state">
				<div className="empty-state-content">
					<span className="empty-icon">⚖️</span>
					<h2>No Products to Compare</h2>
					<p>Add some products to your comparison list to see them side by side.</p>
					<a href="/" className="btn-primary">
						Browse Products
					</a>
				</div>
			</div>
		);
	}

	const filteredRows = highlight ? rows.filter(row => row.isDifferent) : rows;

	return (
		<div className="compare-page">
			<div className="compare-header">
				<h2>
					<span className="compare-icon">⚖️</span>
					Compare Products
				</h2>
				<div className="compare-controls">
					<label className="highlight-toggle">
						<input
							type="checkbox"
							checked={highlight}
							onChange={() => setHighlight(!highlight)}
						/>
						<span>Show Differences Only</span>
					</label>
					<button
						onClick={handleExport}
						className="export-btn"
						disabled={exporting}
					>
						{exporting ? '📸 Exporting...' : '📸 Export as Image'}
					</button>
				</div>
			</div>

			<div className="compare-table-container" ref={compareTableRef}>
				<table className="compare-table">
					<thead>
						<tr>
							<th>Feature</th>
							{products.map(product => (
								<th key={product._id} className="product-column">
									<div className="product-header">
										<button
											className="remove-product-btn"
											onClick={() => removeFromCompare(product._id)}
											title="Remove from compare"
										>
											×
										</button>
										<img src={product.imageUrl || 'https://placehold.jp/150x150.png'} alt={product.name} />
										<h3>{product.name}</h3>
										<button
											className="quick-add-cart"
											onClick={() => handleAddToCart(product)}
										>
											🛒 Add to Cart
										</button>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filteredRows.map(row => {
							const winnerId = getWinner(row, products);
							return (
								<tr key={row.feature} className={row.isDifferent ? 'row-different' : ''}>
									<td className="feature-label">{row.feature}</td>
									{products.map(p => {
										const isWinner = winnerId === p._id;
										const value = String(row.values[p._id.toString()]);
										return (
											<td
												key={p._id}
												className={isWinner ? 'compare-cell-winner' : ''}
											>
												{value}
												{isWinner && (
													<span className="compare-winner-badge">
														{row.feature === 'Price' && '💰 Best Price'}
														{row.feature === 'Rating' && '⭐ Top Rated'}
														{row.feature === 'Stock' && '✅ Available'}
													</span>
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ComparePage;