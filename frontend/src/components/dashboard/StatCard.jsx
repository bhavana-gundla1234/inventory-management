import React from 'react';
import styles from './StatCard.module.css';

export default function StatCard({ title, value, percent, icon: Icon, colorType }) {
    // colorType: 'yellow', 'green', 'pink'

    return (
        <div className={`${styles.statCard} ${styles[colorType]}`}>
            <div className={styles.cardHeader}>
                <span className={styles.title}>{title}</span>
                {Icon && <Icon className={styles.icon} size={18} />}
            </div>
            <div className={styles.value}>{value}</div>
            <div className={styles.percent}>{percent} from last month</div>
        </div>
    );
}
