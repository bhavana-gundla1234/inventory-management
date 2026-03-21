import BuyProductModal from "./BuyProductModal";
import { useState } from "react";
import styles from "./ProductTable.module.css";

function ProductTable({ products, refresh }) {

  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div>

      <table className={styles.table}>

        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {products.map((p) => (

            <tr
              key={p._id}
              onClick={() => setSelectedProduct(p)}
            >

              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>{p.status}</td>

            </tr>

          ))}

        </tbody>

      </table>

      {selectedProduct && (
        <BuyProductModal
          product={selectedProduct}
          close={() => setSelectedProduct(null)}
          refresh={refresh}
        />
      )}

    </div>
  );
}

export default ProductTable;