import { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./Invoices.module.css";
import { apiRequest } from "../../services/api";
import { MoreVertical, CheckCircle, Eye, Trash2 } from "lucide-react";
import ViewInvoiceModal from "./ViewInvoiceModal";

export default function Invoices() {
  const [summary, setSummary] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  const fetchSummary = async () => {
    const res = await apiRequest("/invoices/dashboard", "GET");
    if (res.success) setSummary(res.data);
  };

  const fetchInvoices = async () => {
    setLoading(true);
    const res = await apiRequest(`/invoices/?page=${page}&limit=10`, "GET");
    if (res.success) {
      setInvoices(res.invoices);
      setTotalPages(res.totalPages);
    }
    setLoading(false);
  };

  const handleMarkPaid = async (id) => {
    const res = await apiRequest(`/invoices/paid/${id}`, "PUT");
    if (res.success) {
      setActiveMenu(null);
      fetchInvoices();
      fetchSummary();
    }
  };

  const handleDelete = (id) => {
    setInvoiceToDelete(id);
    setActiveMenu(null);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;
    const res = await apiRequest(`/invoices/${invoiceToDelete}`, "DELETE");
    if (res.success) {
      setInvoiceToDelete(null);
      fetchInvoices();
      fetchSummary();
    }
  };

  const formatCurrency = (val) => {
    return `₹${(val || 0).toLocaleString()}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit"
    }).replace(/ /g, "-");
  };

  // Search works on both short Invoice ID and long Mongo ID
  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout onSearch={setSearchTerm} showSearch={true}>
      <div className={styles.invoicePage}>

        {/* Summary Area */}
        <div className={styles.summaryContainer}>
          <h2 className={styles.summaryTitle}>Overall Invoice</h2>
          <div className={styles.summary}>
            {/* Recent Transactions */}
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.statGroup}>
                  <span className={styles.statMainLabel}>Recent Transactions</span>
                  <div className={styles.statValuesRow}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{summary.recentTransactions || 0}</span>
                      <span className={styles.statSubLabel}>Last 7 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Invoices */}
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.statGroup}>
                  <span className={styles.statMainLabel}>Total Invoices</span>
                  <div className={styles.statValuesRow}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{summary.totalInvoices || 0}</span>
                      <span className={styles.statSubLabel}>Total Till Date</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{summary.processedInvoices || 0}</span>
                      <span className={styles.statSubLabel}>Processed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Paid Amount */}
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.statGroup}>
                  <span className={styles.statMainLabel}>Paid Amount</span>
                  <div className={styles.statValuesRow}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{formatCurrency(summary.paidAmount)}</span>
                      <span className={styles.statSubLabel}>Last 7 days</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{summary.paidCustomers || 0}</span>
                      <span className={styles.statSubLabel}>customers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unpaid Amount */}
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.statGroup}>
                  <span className={styles.statMainLabel}>Unpaid Amount</span>
                  <div className={styles.statValuesRow}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{formatCurrency(summary.unpaidAmount)}</span>
                      <span className={styles.statSubLabel}>Total Pending</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{summary.unpaidCustomers || 0}</span>
                      <span className={styles.statSubLabel}>Customers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices List Area */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h3>Invoices List</h3>
          </div>

          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th className={styles.idCol}>Invoice ID</th>
                <th className={styles.hideOnMobile}>Reference Number</th>
                <th className={styles.hideOnMobile}>Amount (₹)</th>
                <th className={styles.hideOnMobile}>Status</th>
                <th className={styles.hideOnMobile}>Due Date</th>
                <th className={styles.actionCol}></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv, index) => (
                <tr key={inv._id}>
                  <td className={styles.invoiceId}>{inv.invoiceId}</td>
                  <td className={styles.hideOnMobile}>{inv._id}</td>
                  <td className={styles.hideOnMobile}>{formatCurrency(inv.amount)}</td>
                  <td className={styles.hideOnMobile}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </td>
                  <td className={styles.hideOnMobile}>{formatDate(inv.dueDate)}</td>
                  <td className={styles.actionCell}>
                    <div className={styles.directActions}>
                      {inv.status.toLowerCase() === 'paid' ? (
                        <>
                          <button
                            className={styles.viewIconBtn}
                            onClick={() => setSelectedInvoiceForView(inv)}
                            title="View Invoice"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className={styles.deleteIconBtn}
                            onClick={() => setInvoiceToDelete(inv._id)}
                            title="Delete Invoice"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <button
                          className={styles.payBtn}
                          onClick={() => handleMarkPaid(inv._id)}
                        >
                          Pay
                        </button>
                      )}
                    </div>

                    <div ref={activeMenu === index ? menuRef : null}>
                      <button
                        className={styles.threeDots}
                        onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                      >
                        <MoreVertical size={20} />
                      </button>

                      {activeMenu === index && (
                        <div className={styles.menu}>
                          {inv.status === "unpaid" ? (
                            <button
                              className={`${styles.menuItem} ${styles.paidAction}`}
                              onClick={() => handleMarkPaid(inv._id)}
                            >
                              <CheckCircle size={14} />
                              <span>Paid</span>
                            </button>
                          ) : (
                            <>
                              <button
                                className={styles.menuItem}
                                onClick={() => {
                                  setSelectedInvoiceForView(inv);
                                  setActiveMenu(null);
                                }}
                              >
                                <Eye size={14} color="#3b82f6" />
                                <span>View Invoice</span>
                              </button>
                              <button
                                className={styles.menuItem}
                                onClick={() => handleDelete(inv._id)}
                              >
                                <Trash2 size={14} color="#ef4444" />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button
              className={styles.pageBtn}
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Centered Delete Confirmation Modal (Mobile Image 3) */}
        {invoiceToDelete && (
          <div className={styles.modalOverlay} onClick={() => setInvoiceToDelete(null)}>
            <div className={styles.deleteModal} onClick={e => e.stopPropagation()}>
              <div className={styles.deleteModalText}>this invoice will be deleted.</div>
              <div className={styles.deleteModalActions}>
                <button
                  className={styles.modalCancelBtn}
                  onClick={() => setInvoiceToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className={styles.modalConfirmBtn}
                  onClick={confirmDelete}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedInvoiceForView && (
          <ViewInvoiceModal
            invoice={selectedInvoiceForView}
            onClose={() => setSelectedInvoiceForView(null)}
          />
        )}
      </div>
    </Layout>
  );
}