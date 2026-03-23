import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./Products.module.css";
import { apiRequest, BASE_UPLOAD_URL } from "../../services/api";
 
// Import Assets
import SalesIcon from "../../assets/Sales.png";
import CategoriesIcon from "../../assets/Categories.png";
import ProfitIcon from "../../assets/Profit (1).png";
import CostIcon from "../../assets/Cost (1).png";
import CancelIcon from "../../assets/Cancel.png";
 
import AddProductForm from "./AddProductForm";
import CSVUploadModal from "./CSVUploadModal";
import BuyProductModal from "./BuyProductModal";
 
export default function Products() {
  const [summary, setSummary] = useState({});
  const [topSelling, setTopSelling] = useState({});
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState("table"); // table, add-single, add-multiple
  const [selectedProductForBuy, setSelectedProductForBuy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    fetchSummary();
    fetchTopSelling();
  }, []);
 
  useEffect(() => {
    fetchProducts();
  }, [page]);
 
  const fetchSummary = async () => {
    const res = await apiRequest("/products/inventory-summary", "GET");
    if (res.success) setSummary(res.data);
  };
 
  const fetchTopSelling = async () => {
    const res = await apiRequest("/products/top-selling", "GET");
    if (res.success) setTopSelling(res);
  };
 
  const fetchProducts = async () => {
    setIsLoading(true);
    const res = await apiRequest(`/products/?page=${page}&limit=10`, "GET");
    if (res.success) {
      setProducts(res.products);
      setTotalPages(res.totalPages);
    }
    setIsLoading(false);
  };
 
  const handleSaveProduct = async (formData) => {
    const res = await apiRequest("/products/add", "POST", formData);
    if (res.success) {
      setView("table");
      fetchProducts();
      fetchSummary();
    } else {
      alert("Failed to add product");
    }
  };
 
  const handleCSVUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
 
    try {
      const res = await apiRequest("/products/upload-csv", "POST", formData);
      if (res.success) {
        setView("table");
        fetchProducts();
        fetchSummary();
      } else {
        alert(res.message || "CSV Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
 
  const formatCurrency = (val) => {
    return `₹${(val || 0).toLocaleString()}`;
  };
 
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const getStatusClass = (status) => {
    switch (status) {
      case "in-stock": return styles.statusInStock;
      case "low-stock": return styles.statusLowStock;
      case "out-of-stock": return styles.statusOutOfStock;
      default: return "";
    }
  };
 
  const getStatusText = (status) => {
    switch (status) {
      case "in-stock": return "In- stock";
      case "low-stock": return "Low stock";
      case "out-of-stock": return "Out of stock";
      default: return status;
    }
  };
 
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
  };
 
  return (
    <Layout showSearch={view === "table"} onSearch={setSearchTerm}>
      <div className={styles.productsContainer}>
 
        {view === "add-single" ? (
          <AddProductForm
            onSave={handleSaveProduct}
            onCancel={() => setView("table")}
          />
        ) : (
          <>
            {/* Overall Inventory Summary */}
            <div className={styles.inventorySummary}>
              <h2>Overall Inventory</h2>
              <div className={styles.summaryCards}>
                <div className={styles.summaryCard}>
                  <span className={styles.cardTitle}>Categories</span>
                  <div className={styles.cardStats}>
                    <div className={styles.statGroup}>
                      <span className={styles.statValue}>{summary.categoriesCount || 0}</span>
                      <span className={styles.statLabel}>Last 7 days</span>
                    </div>
                  </div>
                </div>
 
                <div className={styles.summaryCard}>
                  <span className={styles.cardTitle}>Total Products</span>
                  <div className={styles.cardStats}>
                    <div className={styles.statGroup}>
                      <span className={styles.statValue}>{summary.totalProducts || 0}</span>
                      <span className={styles.statLabel}>Last 7 days</span>
                    </div>
                    <div className={styles.statGroup}>
                      <span className={styles.statValue}>{formatCurrency(summary.totalValue)}</span>
                      <span className={styles.statLabel}>Revenue</span>
                    </div>
                  </div>
                </div>
 
                <div className={styles.summaryCard}>
                  <span className={styles.cardTitle}>Top Selling</span>
                  <div className={styles.cardStats}>
                    <div className={styles.statGroup}>
                      <span className={styles.statValue}>{topSelling.count || 0}</span>
                      <span className={styles.statLabel}>Last 7 days</span>
                    </div>
                    <div className={styles.statGroup}>
                      <span className={styles.statValue}>{formatCurrency(topSelling.totalValue)}</span>
                      <span className={styles.statLabel}>Cost</span>
                    </div>
                  </div>
                </div>
 
                <div className={styles.summaryCard}>
                  <span className={styles.cardTitle}>Low Stocks</span>
                  <div className={styles.cardStats}>
                    <div className={styles.statGroup}>
                      <span className={styles.statValue}>{summary.lowStockCount || 0}</span>
                      <span className={styles.statLabel}>Low Stock</span>
                    </div>
                    <div className={styles.statGroup}>
                      <span className={styles.statValue}>{summary.outOfStockCount || 0}</span>
                      <span className={styles.statLabel}>Not in stock</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Products Table */}
            <div className={styles.productsTableSection}>
              <div className={styles.tableHeader}>
                <h2>Products</h2>
                <button
                  className={styles.addProductBtnDesktop}
                  onClick={() => setShowAddModal(true)}
                >
                  Add Product
                </button>
              </div>
 
              <div className={styles.tableWrapper}>
                <table>
                  <thead>
                    <tr>
                      <th>Products</th>
                      <th className={styles.hideOnMobile}>Price</th>
                      <th className={styles.hideOnMobile}>Quantity</th>
                      <th className={styles.hideOnMobile}>Threshold Value</th>
                      <th className={styles.hideOnMobile}>Expiry Date</th>
                      <th>Availability</th>
                      <th className={styles.infoCol}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedProductForBuy(product)}
                      >
                        <td className={styles.productNameCol}>
                          <div className={styles.productImageWrapper}>
                            {product.image ? (
                              <img
                                src={product.image.startsWith('http') ? product.image : `${BASE_UPLOAD_URL}/${product.image}`}
                                alt={product.name}
                                className={styles.productTableImage}
                              />
                            ) : (
                              <div className={styles.tableImagePlaceholder}>
                                {product.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className={styles.productName}>{product.name}</span>
                        </td>
                        <td className={styles.hideOnMobile}>{formatCurrency(product.price)}</td>
                        <td className={styles.hideOnMobile}>{product.quantity} {product.unit}</td>
                        <td className={styles.hideOnMobile}>{product.threshold}</td>
                        <td className={styles.hideOnMobile}>{formatDate(product.expiryDate)}</td>
                        <td className={`${styles.status} ${getStatusClass(product.status)}`}>
                          {getStatusText(product.status)}
                        </td>
                        <td className={styles.infoCol}>
                          <div className={styles.infoIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="16" x2="12" y2="12"></line>
                              <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
 
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
 
            {/* Floating Action Button */}
            <div className={styles.fabContainer}>
              <button
                className={styles.fabButton}
                onClick={() => setShowAddModal(true)}
                title="Add Product"
              >
                Add Product
              </button>
            </div>
 
            {view === "add-multiple" && (
              <CSVUploadModal
                onClose={() => setView("table")}
                onUploadSuccess={() => {
                  setView("table");
                  fetchProducts();
                  fetchSummary();
                }}
              />
            )}
 
            {selectedProductForBuy && (
              <BuyProductModal
                product={selectedProductForBuy}
                onClose={() => setSelectedProductForBuy(null)}
                onSuccess={() => {
                  setSelectedProductForBuy(null);
                  fetchProducts();
                  fetchSummary();
                }}
              />
            )}
          </>
        )}
 
        {/* Add Product Selection Modal (Redesigned) */}
        {showAddModal && (
          <div className={styles.selectionModalOverlay} onClick={() => setShowAddModal(false)}>
            <div className={styles.selectionModalContent} onClick={e => e.stopPropagation()}>
              <button
                className={styles.selectionBtn}
                onClick={() => { setView("add-single"); setShowAddModal(false); }}
              >
                individual product
              </button>
              <button
                className={styles.selectionBtn}
                onClick={() => { setView("add-multiple"); setShowAddModal(false); }}
              >
                Multiple product
              </button>
            </div>
          </div>
        )}
 
      </div>
    </Layout>
  );
}
 