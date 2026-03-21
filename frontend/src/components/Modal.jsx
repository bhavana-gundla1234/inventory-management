import styles from "./Modal.module.css";

export default function Modal({ children, close }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {children}
      </div>
    </div>
  );
}