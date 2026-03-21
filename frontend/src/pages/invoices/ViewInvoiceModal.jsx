import React, { useRef } from "react";
import styles from "./ViewInvoiceModal.module.css";
import { X, Download, Printer, Info } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function ViewInvoiceModal({ invoice, onClose }) {
    const invoiceRef = useRef(null);

    const handleDownload = async () => {
        const element = invoiceRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice_${invoice.invoiceId}.pdf`);
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).replace(/ /g, "-");
    };

    const formatCurrency = (val) => {
        return (val || 0).toLocaleString();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <h1 className={styles.headerTitle}>INVOICE</h1>
                        <button className={styles.mobileCloseBtn} onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className={styles.invoicePaper} ref={invoiceRef}>
                        <div className={styles.topSection}>
                            <div className={styles.billedTo}>
                                <span className={styles.sectionLabel}>Billed to</span>
                                <div className={styles.infoText}>
                                    <strong>Company Name</strong><br />
                                    Company address<br />
                                    City, Country - 00000
                                </div>
                            </div>
                            <div className={styles.businessInfo}>
                                <div className={styles.infoText}>
                                    <address className={styles.businessAddr}>
                                        Business address<br />
                                        City, State, IN - 000 000<br />
                                        TAX ID 00XXXXX1234X0XX
                                    </address>
                                </div>
                            </div>
                        </div>

                        <div className={styles.detailsGrid}>
                            <div className={styles.metadataSide}>
                                <div className={styles.metadataItem}>
                                    <span className={styles.metaLabel}>Invoice #</span>
                                    <span className={styles.metaValue}>{invoice.invoiceId}</span>
                                </div>
                                <div className={styles.metadataItem}>
                                    <span className={styles.metaLabel}>Invoice date</span>
                                    <span className={styles.metaValue}>{formatDate(invoice.createdAt)}</span>
                                </div>
                                <div className={styles.metadataItem}>
                                    <span className={styles.metaLabel}>Reference</span>
                                    <span className={styles.metaValue}>INV-057</span>
                                </div>
                                <div className={styles.metadataItem}>
                                    <span className={styles.metaLabel}>Due date</span>
                                    <span className={styles.metaValue}>{formatDate(invoice.dueDate)}</span>
                                </div>
                            </div>

                            <div className={styles.tableSide}>
                                <table className={styles.itemsTable}>
                                    <thead>
                                        <tr>
                                            <th>Products</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Basmati Rice (5kg)</td>
                                            <td className={styles.qtyValue}>1</td>
                                            <td className={styles.priceValue}>1,090</td>
                                        </tr>
                                        <tr>
                                            <td>Aashirvaad Atta (10kg)</td>
                                            <td className={styles.qtyValue}>1</td>
                                            <td className={styles.priceValue}>₹545</td>
                                        </tr>
                                        <tr>
                                            <td>Fortune Sunflower Oil (5L)</td>
                                            <td className={styles.qtyValue}>1</td>
                                            <td className={styles.priceValue}>₹1,090</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className={styles.totalsArea}>
                                    <div className={styles.totalRow}>
                                        <span className={styles.totalLabel}>Subtotal</span>
                                        <span className={styles.totalValue}>₹5,090</span>
                                    </div>
                                    <div className={styles.totalRow}>
                                        <span className={styles.totalLabel}>Tax (10%)</span>
                                        <span className={styles.totalValue}>₹510</span>
                                    </div>
                                    <div className={`${styles.totalRow} ${styles.grandTotalRow}`}>
                                        <span className={styles.grandTotalLabel}>Total due</span>
                                        <span className={styles.grandTotalValue}>₹5,600</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.noteText}>
                            <div className={styles.noteIcon}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <span>Please pay within 15 days of receiving this invoice.</span>
                        </div>
                    </div>

                </div>

                <div className={styles.floatingActions}>
                    <button className={styles.closeCircle} onClick={onClose} title="Close">
                        <X size={24} />
                    </button>
                    <button className={styles.downloadCircle} onClick={handleDownload} title="Download PDF">
                        <Download size={24} />
                    </button>
                    <button className={styles.printCircle} onClick={handlePrint} title="Print Invoice">
                        <Printer size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
