import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./Statistics.module.css";
import { apiRequest } from "../../services/api";
import StatCard from "../../components/dashboard/StatCard";
import SalesPurchaseGraph from "../../components/dashboard/SalesPurchaseGraph";
import TopProducts from "../../components/dashboard/TopProducts";
import { IndianRupee, Box, Activity } from "lucide-react";

export default function Statistics() {
  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState({ sales: [], purchases: [] });
  const [topProducts, setTopProducts] = useState([]);
  const [range, setRange] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, graphRes, tpRes] = await Promise.all([
        apiRequest("/dashboard/statistics", "GET"),
        apiRequest(`/dashboard/sales-purchase-graph?range=${range}`, "GET"),
        apiRequest("/dashboard/top-products", "GET")
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (graphRes.success) setGraphData({ sales: graphRes.sales, purchases: graphRes.purchases });
      if (tpRes.success) setTopProducts(tpRes.topProducts);

    } catch (err) {
      console.error("Statistics fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return `₹${(val || 0).toLocaleString()}`;
  };

  return (
    <Layout>
      <div className={styles.statisticsContainer}>

        {/* Top Summary Cards */}
        <div className={styles.topCards}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            percent="+20.1%"
            icon={IndianRupee}
            colorType="yellow"
          />
          <StatCard
            title="Products Sold"
            value={(stats.productsSold || 0).toLocaleString()}
            percent="+180.1%"
            icon={Box}
            colorType="green"
          />
          <StatCard
            title="Products In Stock"
            value={(stats.productsInStock || 0).toLocaleString()}
            percent="+19%"
            icon={Activity}
            colorType="pink"
          />
        </div>

        {/* Bottom Content Area - Flattened for reordering */}
        <div className={styles.graphSection}>
          <SalesPurchaseGraph
            salesData={graphData.sales}
            purchaseData={graphData.purchases}
            range={range}
            onRangeChange={() => setRange(range === "monthly" ? "weekly" : "monthly")}
          />
        </div>
        <div className={styles.topProductsSection}>
          <TopProducts products={topProducts} />
        </div>

      </div>
    </Layout>
  );
}