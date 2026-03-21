import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import styles from "./Signup.module.css";
import figmaReference from "../../assets/figma_reference.png";
import chartIcon from "../../assets/chart-icon.png";
import { useUser } from "../../context/UserContext";

export default function Signup() {
  const navigate = useNavigate();
  const { fetchUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...signupData } = form;
      const res = await apiRequest("/auth/signup", "POST", signupData);

      if (res.success) {
        if (res.token) {
          localStorage.setItem("token", res.token);
          await fetchUser();
          navigate("/");
        } else {
          navigate("/login");
        }
      } else {
        setError(res.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Pane: Signup Form */}
      <div className={styles.leftPane}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Create an account</h1>
          <p className={styles.subtitle}>Start inventory management.</p>

          {error && <p style={{ color: "red", marginBottom: "1rem", fontSize: "14px" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className={styles.inputField}
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Example@email.com"
                className={styles.inputField}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Create Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="at least 8 characters"
                  className={styles.inputField}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="at least 8 characters"
                  className={styles.inputField}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={styles.signInButton}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <p className={styles.footerText}>
            Do you have an account?
            <Link to="/login" className={styles.signUpLink}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right Pane: Illustration */}
      <div className={styles.rightPane}>
        <div className={styles.welcomeHeader}>
          <h2 className={styles.welcomeText}>
            Welcome to<br />Company Name
          </h2>
          <img src={chartIcon} alt="Chart Icon" className={styles.chartIcon} />
        </div>
        <div className={styles.illustrationContainer}>
          <img
            src={figmaReference}
            alt="Signup Illustration"
            className={styles.mainIllustration}
          />
        </div>
      </div>
    </div>
  );
}