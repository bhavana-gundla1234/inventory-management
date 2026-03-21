import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ChevronDown } from "lucide-react";
import styles from './SalesPurchaseGraph.module.css';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SalesPurchaseGraph({ salesData = [], purchaseData = [], range, onRangeChange }) {

    // Merge sales and purchases into one array for Recharts
    const merged = [];

    if (range === "monthly") {
        // Always show all 12 months
        for (let i = 1; i <= 12; i++) {
            const sale = salesData.find(s => s._id === i);
            const purchase = purchaseData.find(p => p._id === i);
            merged.push({
                name: months[i - 1],
                sales: sale ? sale.total : 0,
                purchase: purchase ? purchase.total : 0
            });
        }
    } else {
        // For weekly, show all 52 weeks of the year
        for (let i = 1; i <= 52; i++) {
            const sale = salesData.find(s => s._id === i);
            const purchase = purchaseData.find(p => p._id === i);
            merged.push({
                name: `W${i}`,
                sales: sale ? sale.total : 0,
                purchase: purchase ? purchase.total : 0
            });
        }
    }

    return (
        <div className={styles.graphCard}>
            <div className={styles.cardHeader}>
                <h3>Sales & Purchase</h3>
                <div className={styles.dropdown} onClick={onRangeChange} style={{ cursor: 'pointer' }}>
                    <span>{range === "weekly" ? "Weekly" : "Monthly"}</span>
                    <ChevronDown size={16} />
                </div>
            </div>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={merged}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            interval={window.innerWidth < 768
                                ? (range === "weekly" ? 9 : 2)
                                : (range === "weekly" ? 3 : 0)
                            }
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f3f4f6' }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="purchase" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="sales" fill="#34d399" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
