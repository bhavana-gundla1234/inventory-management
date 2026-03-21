import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./Settings.module.css";
import { apiRequest } from "../../services/api";
import { useUser } from "../../context/UserContext";

export default function Settings() {
    const { user, loading, updateUserLocal } = useUser();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (formData.password && formData.password.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters long" });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                name: formData.name,
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            const res = await apiRequest("/settings/profile", "PUT", payload);

            if (res.success) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
                updateUserLocal({
                    name: formData.name,
                });
                // Clear password fields
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
            } else {
                setMessage({ type: "error", text: res.message || "Update failed" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className={styles.settingsContainer}>
                    <div className={styles.settingsCard} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
                        Loading your profile...
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.settingsContainer}>
                <div className={styles.settingsCard}>
                    <div className={styles.header}>
                        <div className={styles.tab}>Edit Profile</div>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>First name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                placeholder="Email cannot be changed"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="************"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="************"
                            />
                        </div>

                        {message.text && (
                            <div style={{ color: message.type === "success" ? "#10b981" : "#ef4444", fontSize: "14px", marginTop: "10px" }}>
                                {message.text}
                            </div>
                        )}

                        <div className={styles.actions}>
                            <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
