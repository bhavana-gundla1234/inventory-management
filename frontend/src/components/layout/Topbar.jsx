import styles from "./Topbar.module.css";
import { Search, Bell } from "lucide-react";

export default function Topbar({ title, onSearch, showSearch }) {
    return (
        <div className={styles.topbar}>
            <h1 className={styles.title}>{title || "Home"}</h1>
            {showSearch && (
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search here..."
                        className={styles.searchInput}
                        onChange={(e) => onSearch ? onSearch(e.target.value) : null}
                    />
                </div>
            )}
        </div>
    );
}
