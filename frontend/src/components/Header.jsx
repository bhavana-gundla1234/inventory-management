import styles from "./Header.module.css";

export default function Header({ title }) {
  return (
    <div className={styles.header}>
      <h2>{title}</h2>

      <input
        type="text"
        placeholder="Search here..."
        className={styles.search}
      />
    </div>
  );
}