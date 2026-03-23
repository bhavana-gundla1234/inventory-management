import React from 'react';
import styles from './TopProducts.module.css';
import { BASE_UPLOAD_URL } from '../../services/api';
 
export default function TopProducts({ products = [] }) {
    return (
        <div className={styles.topProductsCard}>
            <h3>Top Products</h3>
            <div className={styles.productList}>
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className={styles.productItem}>
                            <div className={styles.productImageContainer}>
                                {product.image ? (
                                    <img
                                        src={product.image.startsWith('http') ? product.image : `${BASE_UPLOAD_URL}/${product.image}`}
                                        alt={product._id}
                                        className={styles.productImage}
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        {product._id.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className={styles.productInfo}>
                                <span className={styles.productName}>{product._id}</span>
                                <span className={styles.soldCount}>{product.totalSold} sold</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.emptyMsg}>No data available</p>
                )}
            </div>
        </div>
    );
}
 
 
 
 