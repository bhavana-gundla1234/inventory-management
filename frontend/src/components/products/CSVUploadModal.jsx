import styles from "./CSVUploadModal.module.css";

export default function CSVUploadModal({ onClose }) {
  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <div className={styles.header}>
          <h3>CSV Upload</h3>
          <span onClick={onClose}>✕</span>
        </div>

        <div className={styles.dropArea}>
          <p>Drag your file(s) to start uploading</p>

          <button>Browse files</button>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel}>Cancel</button>
          <button className={styles.next}>Next</button>
        </div>

      </div>

    </div>
  );
}