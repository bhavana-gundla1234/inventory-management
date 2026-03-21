import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./Layout.module.css";
import { useLocation, Link } from "react-router-dom";
import { Settings, Home, Package, FileText, BarChart3 } from "lucide-react";
import chartIcon from "../../assets/chart-icon.png";

export default function Layout({ children, onSearch, showSearch }) {
  const location = useLocation();

  const getTitle = (path) => {
    switch (path) {
      case "/":
      case "/dashboard": return "Home";
      case "/products": return "Product";
      case "/invoices": return "Invoice";
      case "/statistics": return "Statistics";
      case "/settings": return "Home";
      default: return "Dashboard";
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <img src={chartIcon} alt="Logo" className={styles.mobileLogo} />
          <Link to="/settings">
            <Settings size={24} color="white" />
          </Link>
        </div>

        <Topbar
          title={getTitle(location.pathname)}
          onSearch={onSearch}
          showSearch={showSearch}
        />
        <div className={styles.content}>{children}</div>

        {/* Mobile Bottom Nav */}
        <nav className={styles.mobileBottomNav}>
          <Link to="/" className={`${styles.navItem} ${location.pathname === "/" ? styles.activeNav : ""}`}>
            <Home size={24} />
          </Link>
          <Link to="/products" className={`${styles.navItem} ${location.pathname === "/products" ? styles.activeNav : ""}`}>
            <Package size={24} />
          </Link>
          <Link to="/invoices" className={`${styles.navItem} ${location.pathname === "/invoices" ? styles.activeNav : ""}`}>
            <FileText size={24} />
          </Link>
          <Link to="/statistics" className={`${styles.navItem} ${location.pathname === "/statistics" ? styles.activeNav : ""}`}>
            <BarChart3 size={24} />
          </Link>
        </nav>
      </div>
    </div>
  );
}