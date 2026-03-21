import React, { useState } from "react";
import styles from "./BuyProductModal.module.css";
import { apiRequest } from "../../services/api";

export default function BuyProductModal({ product, onClose, onSuccess }) {
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBuy = async () => {
        if (quantity < 1 || quantity > product.quantity) {
            alert("Please enter a valid quantity.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiRequest(`/products/buy/${product._id}`, "POST", {
                quantity: parseInt(quantity)
            });

            if (res.success) {
                onSuccess();
            } else {
                alert(res.message || "Purchase failed.");
            }
        } catch (error) {
            console.error("Purchase error:", error);
            alert("An error occurred during purchase.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                <div className={styles.titleBlock}>
                    <h2>Simulate Buy Product</h2>
                </div>

                <div className={styles.inputBlock}>
                    <input
                        type="number"
                        min="1"
                        max={product.quantity}
                        value={quantity === 0 ? "" : quantity}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d+$/.test(val)) {
                                setQuantity(val === "" ? 0 : parseInt(val));
                            }
                        }}
                        placeholder="Enter quantity"
                        autoFocus
                    />
                </div>

                <button
                    className={styles.buyBtnBlock}
                    onClick={handleBuy}
                    disabled={isSubmitting || quantity < 1 || quantity > product.quantity}
                >
                    <span>{isSubmitting ? "..." : "Buy"}</span>
                </button>
            </div>
        </div>
    );
}
