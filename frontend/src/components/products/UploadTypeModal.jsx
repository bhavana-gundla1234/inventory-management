import styles from "./UploadTypeModal.module.css";

export default function UploadTypeModal({ onClose }) {
  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <button className={styles.btn}>Individual product</button>

        <button className={styles.btn}>Multiple product</button>

      </div>

    </div>
  );
}