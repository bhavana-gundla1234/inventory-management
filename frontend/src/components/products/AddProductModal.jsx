import { useState } from "react";
import { apiRequest } from "../../services/api";
import styles from "./AddProductModal.module.css";

function AddProductModal({ close, refresh }) {

  const [form, setForm] = useState({
    name: "",
    productId: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    threshold: ""
  });

  const handleSubmit = async () => {

    await apiRequest("/products/add", "POST", form);

    refresh();
    close();
  };

  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <h3>Add Product</h3>

        {Object.keys(form).map((key) => (

          <input
            key={key}
            placeholder={key}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />

        ))}

        <div className={styles.buttons}>

          <button onClick={handleSubmit}>Add</button>
          <button onClick={close}>Cancel</button>

        </div>

      </div>

    </div>
  );
}

export default AddProductModal;