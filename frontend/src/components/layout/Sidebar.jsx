import styles from "./Sidebar.module.css";
import { Link, useLocation } from "react-router-dom";
import chartIcon from "../../assets/chart-icon.png";
import { Home, Package, FileText, BarChart3, Settings } from "lucide-react";
import { useUser } from "../../context/UserContext";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useUser();

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Product", path: "/products", icon: <Package size={20} /> },
    { name: "Invoice", path: "/invoices", icon: <FileText size={20} /> },
    { name: "Statistics", path: "/statistics", icon: <BarChart3 size={20} /> },
    { name: "Setting", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoAndTitle}>
        <img src={chartIcon} alt="Logo" className={styles.logoImg} />
      </div>

      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`${styles.menuLink} ${location.pathname === item.path ? styles.active : ""}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || "User"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}