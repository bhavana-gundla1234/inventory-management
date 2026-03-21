import styles from "./InvoiceViewModal.module.css";

export default function InvoiceViewModal({ onClose }) {

  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <div className={styles.header}>
          <h2>INVOICE</h2>
          <span onClick={onClose}>✕</span>
        </div>

        <div className={styles.details}>

          <div>
            <p>Invoice #</p>
            <b>INV-1007</b>
          </div>

          <div>
            <p>Date</p>
            <b>01-Apr-2025</b>
          </div>

        </div>

        <table className={styles.table}>

          <thead>
            <tr>
              <th>Products</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Basmati Rice</td>
              <td>1</td>
              <td>₹1,090</td>
            </tr>

            <tr>
              <td>Sunflower Oil</td>
              <td>1</td>
              <td>₹1,090</td>
            </tr>
          </tbody>

        </table>

        <div className={styles.total}>
          <h3>Total: ₹5,600</h3>
        </div>

      </div>

    </div>
  );
}