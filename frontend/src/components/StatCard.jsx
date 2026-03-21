import styles from "./StatCard.module.css";

export default function StatCard({ title, value, color }) {
  return (
    <div className={styles.card} style={{ background: color }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}