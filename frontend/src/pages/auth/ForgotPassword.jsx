import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import styles from "./ForgotPassword.module.css";
import chartIcon from "../../assets/chart-icon.png";
import stage1Img from "../../assets/Women Web Developer with laptop.png";
import stage2Img from "../../assets/Startup.png";
import stage3Img from "../../assets/Group.png";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.toast}>
      {message}
    </div>
  );
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await apiRequest("/auth/forgot-password", "POST", { email });
      if (res.success) {
        setToastMsg(`Your OTP is: ${res.otp}`);
        setStage(2);
      } else {
        setError(res.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await apiRequest("/auth/verify-otp", "POST", { email, otp });
      if (res.success) {
        setStage(3);
      } else {
        setError(res.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiRequest("/auth/reset-password", "POST", { email, newPassword });
      if (res.success) {
        setToastMsg("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(res.message || "Reset failed");
      }
    } catch (err) {
      setError("An error occurred during reset.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (stage) {
      case 1:
        return (
          <form onSubmit={handleSendEmail}>
            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.signInButton} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Mail"}
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyOtp}>
            <div className={styles.formGroup}>
              <label className={styles.label}>OTP</label>
              <input
                type="text"
                placeholder="xxxx05"
                className={styles.inputField}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.signInButton} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Confirm"}
            </button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleResetPassword}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Enter New Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="at least 8 characters"
                  className={styles.inputField}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="at least 8 characters"
                  className={styles.inputField}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>
            <button type="submit" className={styles.signInButton} disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  const getStageContent = () => {
    switch (stage) {
      case 1:
        return {
          title: "Company name",
          subtitle: "Please enter your registered email ID to receive an OTP",
          image: stage1Img
        };
      case 2:
        return {
          title: "Enter Your OTP",
          subtitle: "We've sent a 6-digit OTP to your registered mail. Please enter it below to sign in.",
          image: stage2Img
        };
      case 3:
        return {
          title: "Create New Password",
          subtitle: "Today is a new day. It's your day. You shape it. Sign in to start managing your projects.",
          image: stage3Img
        };
      default:
        return {};
    }
  };

  const content = getStageContent();

  return (
    <div className={styles.loginContainer}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      <div className={styles.leftPane}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>{content.title}</h1>
          <p className={styles.subtitle}>{content.subtitle}</p>

          {error && <p style={{ color: "red", marginBottom: "1rem", fontSize: "14px" }}>{error}</p>}

          {renderForm()}

          <p className={styles.footerText}>
            Do you have an account?
            <Link to="/login" className={styles.signUpLink}>Sign in</Link>
          </p>
        </div>
      </div>

      <div className={styles.rightPane}>
        <div className={styles.welcomeHeader}>
          <h2 className={styles.welcomeText}>
            Welcome to<br />Company Name
          </h2>
          <img src={chartIcon} alt="Chart Icon" className={styles.chartIcon} />
        </div>
        <div className={styles.illustrationContainer}>
          <img
            src={content.image}
            alt="Step Illustration"
            className={styles.mainIllustration}
          />
        </div>
      </div>
    </div>
  );
}