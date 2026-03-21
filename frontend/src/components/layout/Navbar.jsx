import styles from "./Navbar.module.css";

function Navbar() {

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={styles.navbar}>

      <h3 className={styles.title}>Dashboard</h3>

      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default Navbar;