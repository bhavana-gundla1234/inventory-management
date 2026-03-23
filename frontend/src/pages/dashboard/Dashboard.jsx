import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./Dashboard.module.css";
import { apiRequest } from "../../services/api";
import { ChevronDown } from "lucide-react";
import SalesPurchaseGraph from "../../components/dashboard/SalesPurchaseGraph";
import TopProducts from "../../components/dashboard/TopProducts";
 
// Import Assets
import SalesIcon from "../../assets/Sales.png";
import RevenueIcon from "../../assets/Revenue.png";
import ProfitIcon from "../../assets/Profit.png";
import CostIcon from "../../assets/Cost.png";
import PurchaseIcon from "../../assets/Purchase.png";
import PurchaseCostIcon from "../../assets/Cost (1).png";
import CancelIcon from "../../assets/Cancel.png";
import ReturnIcon from "../../assets/Profit (1).png";
import QuantityIcon from "../../assets/Quantity.png";
import OnTheWayIcon from "../../assets/On the way.png";
import SuppliersIcon from "../../assets/Suppliers.png";
import CategoriesIcon from "../../assets/Categories.png";
 
export default function Dashboard() {
  const [overview, setOverview] = useState({});
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
      const [ovRes, grRes, tpRes] = await Promise.all([
        apiRequest("/dashboard/overview", "GET"),
        apiRequest(`/dashboard/sales-purchase-graph?range=${range}`, "GET"),
        apiRequest("/dashboard/top-products", "GET")
      ]);
 
      if (ovRes.success) setOverview(ovRes.data);
 
      if (grRes.success) {
        setGraphData({ sales: grRes.sales, purchases: grRes.purchases });
      }
 
      if (tpRes.success) setTopProducts(tpRes.topProducts);
 
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };
 
  const formatCurrency = (val) => {
    return `₹${(val || 0).toLocaleString()}`;
  };
 
  return (
    <Layout>
      <div className={styles.dashboardContainer}>
 
        {/* Top Row: Overview Cards */}
        <div className={styles.topRow}>
          <div className={`${styles.leftColumn} ${styles.salesArea}`}>
            <div className={styles.overviewCard}>
              <h3>Sales Overview</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={SalesIcon} alt="Sales" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>{overview.salesCount || 0}</span>
                    <span className={styles.statName}>Sales</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={RevenueIcon} alt="Revenue" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>{formatCurrency(overview.totalSalesValue)}</span>
                    <span className={styles.statName}>Revenue</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={ProfitIcon} alt="Profit" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>{formatCurrency(overview.profit)}</span>
                    <span className={styles.statName}>Profit</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={CostIcon} alt="Cost" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>{formatCurrency(3889)}</span>
                    <span className={styles.statName}>Cost</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          <div className={`${styles.rightColumn} ${styles.inventoryArea}`}>
            <div className={styles.summaryCard}>
              <h3>Inventory Summary</h3>
              <div className={styles.summaryStats}>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={QuantityIcon} alt="Quantity in Hand" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>{overview.totalItemsInStock || 0}</span>
                    <span className={styles.statName}>Quantity in Hand</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={OnTheWayIcon} alt="To be received" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>200</span>
                    <span className={styles.statName}>To be received</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Second Row: Purchase & Product */}
        <div className={styles.topRow}>
          <div className={`${styles.leftColumn} ${styles.purchaseArea}`}>
            <div className={styles.overviewCard}>
              <h3>Purchase Overview</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={PurchaseIcon} alt="Purchase" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>{overview.purchaseCount || 0}</span>
                    <span className={styles.statName}>Purchase</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={PurchaseCostIcon} alt="Cost" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>{formatCurrency(overview.totalPurchaseValue)}</span>
                    <span className={styles.statName}>Cost</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={CancelIcon} alt="Cancel" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>5</span>
                    <span className={styles.statName}>Cancel</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={ReturnIcon} alt="Return" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>{formatCurrency(17432)}</span>
                    <span className={styles.statName}>Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          <div className={`${styles.rightColumn} ${styles.productArea}`}>
            <div className={styles.summaryCard}>
              <h3>Product Summary</h3>
              <div className={styles.summaryStats}>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={SuppliersIcon} alt="Suppliers" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>31</span>
                    <span className={styles.statName}>Number of Suppliers</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.iconBox}>
                    <img src={CategoriesIcon} alt="Categories" />
                  </div>
                  <div className={styles.statLabel}>
                    <span className={styles.statValue}>{overview.categoriesCount || 0}</span>
                    <span className={styles.statName}>Number of Categories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Bottom Row: Graph and Top Products */}
        <div className={styles.bottomRow}>
          <div className={`${styles.leftColumn} ${styles.graphArea}`}>
            <SalesPurchaseGraph
              salesData={graphData.sales || []}
              purchaseData={graphData.purchases || []}
              range={range}
              onRangeChange={() => setRange(range === "monthly" ? "weekly" : "monthly")}
            />
          </div>
          <div className={`${styles.rightColumn} ${styles.topProductsArea}`}>
            <TopProducts products={topProducts} />
          </div>
        </div>
 
      </div>
    </Layout>
  );
}
 