import { useState } from "react";
import { apiRequest } from "../../services/api";
import styles from "./BuyProductModal.module.css";

function BuyProductModal({ product, close, refresh }) {

  const [quantity, setQuantity] = useState(1);

  const buyProduct = async () => {

    await apiRequest(`/products/buy/${product._id}`, "POST", {
      quantity
    });

    refresh();
    close();
  };

  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <h3>Buy {product.name}</h3>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button onClick={buyProduct}>Buy</button>

      </div>

    </div>
  );
}

export default BuyProductModal;