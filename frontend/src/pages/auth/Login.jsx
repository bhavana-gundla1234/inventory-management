import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import styles from "./Login.module.css";
import loginIllustration from "../../assets/login-illustration.png";
import chartIcon from "../../assets/chart-icon.png";
 
import { useUser } from "../../context/UserContext";
 
export default function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
 
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiRequest("/auth/login", "POST", form);
      if (res.token) {
        localStorage.setItem("token", res.token);
        await fetchUser(); // Fetch user data immediately
        navigate("/");
      } else {
        alert(res.message || "Login failed");
      }
    } catch (error) {
      alert("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className={styles.loginContainer}>
      {/* Left Pane: Login Form */}
      <div className={styles.leftPane}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Log in to your account</h1>
          <p className={styles.subtitle}>Welcome back! Please enter your details.</p>
 
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                className={styles.inputField}
                placeholder="Example@email.com"
                onChange={handleChange}
                required
              />
            </div>
 
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={styles.inputField}
                  placeholder="at least 8 characters"
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
              <span
                className={styles.forgotPassword}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </div>
 
            <button
              type="submit"
              className={styles.signInButton}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
 
          <p className={styles.footerText}>
            Don't you have an account?
            <span className={styles.signUpLink} onClick={() => navigate("/signup")}>
              Sign up
            </span>
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
            src={loginIllustration}
            alt="Login Illustration"
            className={styles.mainIllustration}
          />
        </div>
      </div>
    </div>
  );
}
 
 