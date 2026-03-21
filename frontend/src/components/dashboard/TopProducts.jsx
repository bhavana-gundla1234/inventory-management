import React from 'react';
import styles from './TopProducts.module.css';

export default function TopProducts({ products = [] }) {
    return (
        <div className={styles.topProductsCard}>
            <h3>Top Products</h3>
            <div className={styles.productList}>
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className={styles.productItem}>
                            <div className={styles.productInfo}>
                                <span className={styles.productName}>{product._id}</span>
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
